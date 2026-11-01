// TS 소스에서 styled.button·styled(Button) 정의와 그 JSX 사용처를 뽑는다.
import { createHash } from 'node:crypto';
import ts from 'typescript';
import {
  buttonSignature,
  DYNAMIC,
  overridesAppearance,
  parseCss,
} from './signature.mjs';

export const COMMON_BUTTON = 'src/components/common/Button/Button.tsx';
const COMMON = Symbol('common-button');

// colors.gray[900] → ['colors', 'gray', '900']. 다른 모양이면 null.
function pathOf(expr) {
  if (ts.isIdentifier(expr)) return [expr.text];
  if (ts.isPropertyAccessExpression(expr)) {
    const p = pathOf(expr.expression);
    return p && [...p, expr.name.text];
  }
  if (
    ts.isElementAccessExpression(expr) &&
    (ts.isNumericLiteral(expr.argumentExpression) ||
      ts.isStringLiteral(expr.argumentExpression))
  ) {
    const p = pathOf(expr.expression);
    return p && [...p, expr.argumentExpression.text];
  }
  return null;
}

function lookup(expr, values, themeInScope) {
  const p = pathOf(expr);
  if (!p) return undefined;
  const roots = {
    colors: values.theme.colors,
    typography: values.theme.typography,
    transitions: values.theme.transitions,
    media: values.media,
    ...(themeInScope ? { theme: values.theme } : {}),
  };
  let cur = roots[p[0]];
  for (const seg of p.slice(1)) {
    if (cur == null) return undefined;
    cur = cur[seg];
  }
  return cur;
}

// 풀면 CSS 문자열, 못 풀면 null
function resolveExpr(expr, values, themeInScope = false) {
  if (
    ts.isStringLiteral(expr) ||
    ts.isNoSubstitutionTemplateLiteral(expr) ||
    ts.isNumericLiteral(expr)
  )
    return expr.text;
  if (ts.isParenthesizedExpression(expr))
    return resolveExpr(expr.expression, values, themeInScope);
  if (
    ts.isCallExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'setTypography' &&
    expr.arguments.length === 1
  ) {
    const t = lookup(expr.arguments[0], values, themeInScope);
    return t && typeof t === 'object' && 'size' in t
      ? `font-size: ${t.size}; font-weight: ${t.weight}; line-height: ${t.lineHeight}`
      : null;
  }
  // ({ theme }) => theme.colors.x 만 푼다. 다른 props를 받으면 자리마다 값이 달라진다.
  if (
    ts.isArrowFunction(expr) &&
    expr.parameters.length === 1 &&
    !ts.isBlock(expr.body)
  ) {
    const param = expr.parameters[0].name;
    const onlyTheme =
      ts.isObjectBindingPattern(param) &&
      param.elements.length === 1 &&
      !param.elements[0].propertyName &&
      ts.isIdentifier(param.elements[0].name) &&
      param.elements[0].name.text === 'theme';
    return onlyTheme ? resolveExpr(expr.body, values, true) : null;
  }
  const v = lookup(expr, values, themeInScope);
  return typeof v === 'string' || typeof v === 'number' ? String(v) : null;
}

function expandTemplate(template, values) {
  if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
  let css = template.head.text;
  for (const span of template.templateSpans) {
    const piece = resolveExpr(span.expression, values) ?? DYNAMIC;
    const before = css.trimEnd();
    // 문장 자리(`;`·`{`·`}` 뒤)의 믹스인은 `;`로 닫아야 다음 선언과 안 붙는다. `${media.x} {`는 예외.
    const statement = before === '' || /[;{}]$/.test(before);
    const opensBlock = span.literal.text.trimStart().startsWith('{');
    css += statement && !opensBlock ? `${piece};` : piece;
    css += span.literal.text;
  }
  return css;
}

// styled.x.attrs(...)·styled(X).attrs(...)의 attrs를 벗긴다
function unwrapAttrs(tag) {
  if (
    ts.isCallExpression(tag) &&
    ts.isPropertyAccessExpression(tag.expression) &&
    tag.expression.name.text === 'attrs'
  )
    return tag.expression.expression;
  return tag;
}

// styled(X)의 X. styled(...) 호출 모양이 아니면 null
function styledArg(tag) {
  const t = unwrapAttrs(tag);
  return ts.isCallExpression(t) &&
    ts.isIdentifier(t.expression) &&
    t.expression.text === 'styled' &&
    t.arguments.length === 1
    ? t.arguments[0]
    : null;
}

function styledKind(tag, defaults) {
  const t = unwrapAttrs(tag);
  if (
    ts.isPropertyAccessExpression(t) &&
    ts.isIdentifier(t.expression) &&
    t.expression.text === 'styled' &&
    t.name.text === 'button'
  )
    return 'styled.button';
  const arg = styledArg(tag);
  if (!arg) return null;
  // framer-motion의 motion.button도 결국 <button>을 그린다
  if (
    ts.isPropertyAccessExpression(arg) &&
    ts.isIdentifier(arg.expression) &&
    arg.expression.text === 'motion' &&
    arg.name.text === 'button'
  )
    return 'styled.button';
  if (ts.isIdentifier(arg) && defaults.get(arg.text) === COMMON_BUTTON)
    return 'styled(Button)';
  return null;
}

// styled(X)의 X가 어느 파일의 어느 이름인지. 버튼인지는 모든 파일을 본 뒤 resolveDerived가 정한다.
function derivedSource(arg, imports, file) {
  if (ts.isIdentifier(arg)) {
    const id = arg.text;
    const defaultTarget = imports.defaults.get(id);
    if (defaultTarget) return { file: defaultTarget, name: 'default' };
    return imports.named.get(id) ?? { file, name: id };
  }
  if (ts.isPropertyAccessExpression(arg) && ts.isIdentifier(arg.expression)) {
    const ns = imports.namespaces.get(arg.expression.text);
    return ns ? { file: ns, name: arg.name.text } : null;
  }
  return null;
}

function readImports(sf, file, resolveModule) {
  const namespaces = new Map();
  const named = new Map();
  const defaults = new Map();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause) continue;
    const target = resolveModule(file, st.moduleSpecifier.text);
    if (!target) continue;
    const { name, namedBindings } = st.importClause;
    if (name) defaults.set(name.text, target);
    if (namedBindings && ts.isNamespaceImport(namedBindings))
      namespaces.set(namedBindings.name.text, target);
    if (namedBindings && ts.isNamedImports(namedBindings))
      for (const el of namedBindings.elements)
        named.set(el.name.text, {
          file: target,
          name: (el.propertyName ?? el.name).text,
        });
  }
  return { namespaces, named, defaults };
}

function tagTarget(tagName, imports, file) {
  if (
    ts.isPropertyAccessExpression(tagName) &&
    ts.isIdentifier(tagName.expression)
  ) {
    const ns = imports.namespaces.get(tagName.expression.text);
    return ns ? { file: ns, name: tagName.name.text } : null;
  }
  if (!ts.isIdentifier(tagName) || !/^[A-Z]/.test(tagName.text)) return null;
  const id = tagName.text;
  const defaultTarget = imports.defaults.get(id);
  if (defaultTarget === COMMON_BUTTON) return COMMON;
  // 기본 import는 로컬 별칭이 자유로워 이름으로 못 잇는다. 정의 파일의 default export로 잇는다.
  if (defaultTarget) return { file: defaultTarget, name: 'default' };
  return imports.named.get(id) ?? { file, name: id };
}

function attrLiteral(attributes, attrName) {
  for (const a of attributes.properties) {
    if (
      !ts.isJsxAttribute(a) ||
      !ts.isIdentifier(a.name) ||
      a.name.text !== attrName
    )
      continue;
    if (!a.initializer) return 'true';
    if (ts.isStringLiteral(a.initializer)) return a.initializer.text;
    if (
      ts.isJsxExpression(a.initializer) &&
      a.initializer.expression &&
      ts.isStringLiteral(a.initializer.expression)
    )
      return a.initializer.expression.text;
    return '{expr}';
  }
  return null;
}

// 자식이 글자뿐일 때만 라벨이다. 표현식이 섞이면 locator로 못 쓴다.
function labelOf(el) {
  const parts = [];
  for (const c of el.children) {
    if (ts.isJsxText(c)) {
      const t = c.text.trim();
      if (t) parts.push(t);
    } else if (
      ts.isJsxExpression(c) &&
      c.expression &&
      ts.isStringLiteral(c.expression)
    ) {
      parts.push(c.expression.text);
    } else {
      return null;
    }
  }
  return parts.length ? parts.join(' ') : null;
}

export function analyzeFile({ file, text, values, resolveModule }) {
  const sf = ts.createSourceFile(
    file,
    text,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const imports = readImports(sf, file, resolveModule);
  const lineOf = (node) =>
    sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const definitions = [];
  const usages = [];
  const derivedCandidates = [];
  let commonButtonUsages = 0;
  // <button>을 직접 그리는 파일인지. 못 푼 styled(X)를 리포트에 "버튼일 수 있음"으로 올릴 때 쓴다
  let rendersButton = false;
  // 이 파일의 default export가 가리키는 정의 이름. 못 찾으면 null
  let defaultExport = null;

  const pushDefinition = (node, name, kind, template) => {
    const parsed = parseCss(expandTemplate(template, values));
    definitions.push({
      file,
      name,
      kind,
      line: lineOf(node),
      ...buttonSignature(parsed),
      overridesAppearance:
        kind === 'styled(Button)' && overridesAppearance(parsed),
    });
  };

  // 버튼 정의면 정의로, styled(X)면 X가 버튼인지 나중에 가릴 후보로 둔다. 둘 다 아니면 false
  const collect = (node, name, tagged) => {
    const kind = styledKind(tagged.tag, imports.defaults);
    if (kind) {
      pushDefinition(node, name, kind, tagged.template);
      return true;
    }
    const arg = styledArg(tagged.tag);
    if (!arg) return false;
    const parsed = parseCss(expandTemplate(tagged.template, values));
    derivedCandidates.push({
      file,
      name,
      line: lineOf(node),
      fromText: arg.getText(sf),
      from: derivedSource(arg, imports, file),
      ...buttonSignature(parsed),
      overridesCss: overridesAppearance(parsed),
    });
    return true;
  };

  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      ts.isTaggedTemplateExpression(node.initializer)
    )
      collect(node, node.name.text, node.initializer);
    // export default X; → X가 정의 이름. export default styled.button`...`;는 그 자체가 정의
    if (ts.isExportAssignment(node) && !node.isExportEquals) {
      if (ts.isIdentifier(node.expression)) {
        defaultExport = node.expression.text;
      } else if (
        ts.isTaggedTemplateExpression(node.expression) &&
        collect(node, 'default', node.expression)
      ) {
        defaultExport = 'default';
      }
    }
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      if (ts.isIdentifier(opening.tagName) && opening.tagName.text === 'button')
        rendersButton = true;
      const target = tagTarget(opening.tagName, imports, file);
      if (target === COMMON) commonButtonUsages += 1;
      else if (target)
        usages.push({
          defFile: target.file,
          name: target.name,
          usageFile: file,
          line: lineOf(node),
          typeAttr: attrLiteral(opening.attributes, 'type'),
          label: ts.isJsxElement(node) ? labelOf(node) : null,
        });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return {
    definitions,
    usages,
    commonButtonUsages,
    defaultExport,
    derivedCandidates,
    rendersButton,
  };
}

// styled(X) 후보 중 X가 버튼 정의(파생 포함)로 풀리는 것을 파생 버튼 정의로 만든다. 연쇄(styled(styled(Button)))
// 때문에 더 풀리는 게 없을 때까지 돈다. 바탕 스타일은 X에서 오므로 자기 템플릿만으로는 묶음 후보가 될 수 없어
// dynamic에 'inherits'를 넣고, 묶음 키에도 X를 섞어 같은 템플릿의 일반 정의와 한 묶음이 되지 않게 한다.
export function resolveDerived({ definitions, candidates, defaultExports }) {
  const ref = (from) =>
    from &&
    `${from.file}::${from.name === 'default' ? (defaultExports.get(from.file) ?? 'default') : from.name}`;
  const known = new Map(definitions.map((d) => [`${d.file}::${d.name}`, d]));
  let pending = [...candidates];
  const derived = [];
  for (let progressed = true; progressed; ) {
    progressed = false;
    const rest = [];
    for (const c of pending) {
      const from = ref(c.from);
      const base = known.get(from);
      if (!base) {
        rest.push(c);
        continue;
      }
      // 겉모습 덮어쓰기 지표(스펙 9절)는 공용 Button에서 내려온 것만 센다
      const fromCommon =
        base.kind === 'styled(Button)' || base.fromCommon === true;
      const d = {
        file: c.file,
        name: c.name,
        kind: 'styled(button-def)',
        line: c.line,
        base: c.base,
        nested: c.nested,
        dynamic: [...c.dynamic, 'inherits'],
        key: createHash('sha1')
          .update(JSON.stringify([c.key, from]))
          .digest('hex')
          .slice(0, 8),
        overridesAppearance: fromCommon && c.overridesCss,
        inherits: from,
        fromCommon,
      };
      known.set(`${d.file}::${d.name}`, d);
      derived.push(d);
      progressed = true;
    }
    pending = rest;
  }
  const order = (a, b) =>
    a.file.localeCompare(b.file) || a.name.localeCompare(b.name);
  return { derived: derived.sort(order), unresolved: pending.sort(order) };
}
