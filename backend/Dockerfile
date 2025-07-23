#ARM 빌드를위해 ARM 지원되는 jdk 사용
FROM eclipse-temurin:17-jdk

#도커 이미지 내의 작업 디렉토리 정의
WORKDIR /moadong/backend

#빌드 인자 기본값 정의
ARG JAR_FILE=/build/libs/moadong-0.0.1-SNAPSHOT.jar

#호스트 시스템에서 빌드된 Jar파일을 도커 이미지 내부로 옮김
COPY ${JAR_FILE} /moadong.jar

#컨테이너 실행 명령어
#ex) java -jar -Dspring.profiles.active=prod /sejongmate.jar
ENTRYPOINT ["java","-jar","/moadong.jar"]