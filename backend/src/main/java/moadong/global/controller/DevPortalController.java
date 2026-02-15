package moadong.global.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DevPortalController {

    @GetMapping({"/dev", "/dev/"})
    public String devPortal() {
        return "redirect:/dev/index.html";
    }
}
