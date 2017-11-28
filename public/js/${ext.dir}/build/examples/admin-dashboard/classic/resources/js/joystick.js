(function($)
{

        var toggle=false;
        var down = [];
        $(document).keydown(function(e) {
            down[e.keyCode] = true;
        }).keyup(function(e) {
            if (down[16] && down[78]) {
                console.log('Nueva Infraccion');
            }
            if (down[16] && down[67]) {
                console.log('Captura Imagen');
            }
            if (down[16] && down[79]) {
                console.log('Video de 8 segundos');
            }
            if (down[16] && down[73]) {
                if (toggle===false) {
                    console.log('Iniciar video');
                    toggle=true;
                }else{
                    console.log('Detener video');
                    toggle=false;
                }
            }
            down[e.keyCode] = false;
        });
   

    
        
        var hasGP = false;
        var repGP;  
        var pan_value=0;
        var til_value=-47;
        var zoom_value=40;
        var pan_continous=0;

        function canGame() {
            return "getGamepads" in navigator;
        }

        var once_zoom = function(zoom_value) {
            if(once_zoom.done) return;
            $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&zoom="+zoom_value);
            once_zoom.done = true;
            console.log('Reset_Zoom');
        };

        var once = function() {
            if(once.done) return;
            $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,0");
            pan_value=0;
            once.done = true;
            console.log('Reset View');
        };

        function reportOnGamepad() {
            var gp = navigator.getGamepads()[0];
            var html = "";
                html += "id: "+gp.id+"<br/>";
                var rigth_pad =5;
                var left_pad =4;
                var j4_pad =3;
                var j3_pad =2;
                var j2_pad =1;
                var j1_pad =0;
                var movement_dead_zone=0.02;
                var movement_sensibility = 80;
                var zoom_dead_zone = 0.4;
                var zoom_sensibility = 1000;

                if (gp.buttons[j1_pad].pressed) {
                    alert('Captura Imagen 1');
                }
                if (gp.buttons[j2_pad].pressed) {
                    alert('Captura Imagen 2');
                }
                if (gp.buttons[j3_pad].pressed) {
                    alert('Captura Imagen 3');
                }
                if (gp.buttons[j4_pad].pressed) {
                    alert('Captura Imagen 4');
                }
                if (gp.buttons[left_pad].pressed) {
                    $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&move=home&speed=100")
                    pan_value=0;
                    til_value=-47;
                    zoom_value=40;
                    pan_continous=0;
                    console.log('home');
                }
                if (gp.buttons[rigth_pad].pressed) {
                    $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&zoom=40");
                    pan_value=0;
                    til_value=-47;
                    zoom_value=40;
                    pan_continous=0;
                    console.log('zoom home');
                }
                var i=0;
                html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+","+gp.axes[i+1]+"<br/>";
                if ((Math.ceil(i/2)+1)===1) {
                        if (Math.abs(gp.axes[i]) > movement_dead_zone) {
                        pan_value=gp.axes[i]*movement_sensibility / 2;
                        if (pan_value >= 180) {
                            pan_value=180;
                        }
                        if (pan_value <= -180) {
                            pan_value=-180;
                        }
                        if (gp.axes[i+1]< -movement_dead_zone && gp.axes[i] <-movement_dead_zone) {
                            pan_continous=0;
                            console.log('Diagonal superior izquierdo');
                            pan_continous=Math.abs(gp.axes[i])*movement_sensibility;
                        }else if (gp.axes[i] > 0 && gp.axes[i+1] < -0 ) {
                            pan_continous=0;
                            console.log('Diagonal superior derecho');
                            pan_continous=Math.abs(gp.axes[i])*movement_sensibility;
                        }else if (gp.axes[i] < -movement_dead_zone && gp.axes[i+1] > movement_dead_zone ) {
                            pan_continous=0;
                            console.log('Diagonal inferior izquierdo');
                            pan_continous=-Math.abs(gp.axes[i]+1)*movement_sensibility;
                        }else if (gp.axes[i] > movement_dead_zone && gp.axes[i+1] > movement_dead_zone ) {
                            pan_continous=0;
                            console.log('Diagonal inferior derecho');
                            pan_continous=-Math.abs(gp.axes[i+1])*movement_sensibility;
                        }else{
                            pan_continous=0;
                        }              
                        
                        $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove="+pan_value+","+pan_continous);
                           

                        once.done = false;
                        }
                        else if (gp.axes[i] ===0  && gp.axes[i+1] <=-movement_dead_zone) {
                            pan_continous=Math.abs(gp.axes[i+1])*movement_sensibility;
                            $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,"+pan_continous);
                            once.done = false;
                        }else if (gp.axes[i]===0 && gp.axes[i+1] >=movement_dead_zone) {
                            pan_continous=-Math.abs(gp.axes[i+1])*movement_sensibility;
                            $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&continuouspantiltmove=0,"+pan_continous);
                            once.done = false;
                        }
                    if (gp.axes[i]===0 && gp.axes[i+1]===0) {
                        once();
                    }
                 i=2;
                 html+= "Stick "+(Math.ceil(i/2)+1)+": "+gp.axes[i]+"<br/>";
                 if ((Math.ceil(i/2)+1)===2) {
                            if (gp.axes[i]>zoom_dead_zone) {
                                console.log('Zoom ');
                                    $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&zoom=10900");
                                    zoom_value=zoom_value + gp.axes[i] * 150;
                                    if (zoom_value >=10900 ) {
                                        zoom_value=10900;
                                        }
                                    once_zoom.done = false;
                                
                             }else if (gp.axes[i]<-zoom_dead_zone) {
                                console.log('Zoom out');
                                $.get("http://"+IP_CAMERA+"/axis-cgi/com/ptz.cgi?camera=1&zoom=40");
                                zoom_value=zoom_value - (Math.abs(gp.axes[i]) * 250);
                                 if (zoom_value <=40 ) {
                                        zoom_value=40;
                                        }
                                once_zoom.done = false;
                             }
                             else  {
                                    once_zoom(zoom_value);
                             }    
                    }
                }

            $("#gamepadDisplay").html(html);
        }



        $(document).ready(function() {
     
            if(canGame()) {
     
                var prompt = "To begin using your gamepad, connect it and press any button!";
                $("#gamepadPrompt").text(prompt);
     
                $(window).on("gamepadconnected", function() {
                    hasGP = true;
                    $("#gamepadPrompt").html("Gamepad connected!");
                    console.log("connection event");
                    repGP = window.setInterval(reportOnGamepad,100);
                });
     
                $(window).on("gamepaddisconnected", function() {
                    console.log("disconnection event");
                    $("#gamepadPrompt").text(prompt);
                    window.clearInterval(repGP);
                });
     
                //setup an interval for Chrome
                var checkGP = window.setInterval(function() {
                    if(navigator.getGamepads()[0]) {
                        if(!hasGP) $(window).trigger("gamepadconnected");
                        window.clearInterval(checkGP);
                    }
                }, 500);
            }
     
        });

}(jQuery));
