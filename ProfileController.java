package com.example.myprofile;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProfileController {

    @GetMapping("/")
    public String getProfilePage() {
        // Returns the responsive cross-platform page
        return "index";
    }
}
