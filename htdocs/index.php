<html>
    <head>
        <title>VividLearn</title> <!-- Page Title -->
        <link rel="stylesheet" type="text/css" href="/css/global.css" /> <!-- Link To Global Stylesheet -->
        <link rel="stylesheet" type="text/css" href="/css/cParse.css" /> <!-- Link To cParse Stylesheet -->
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" /> <!-- Link To Fonts Stylesheet -->
        <link rel="stylesheet" type="text/css" href="/css/index.css" /> <!-- Link To Index Stylesheet -->
        <script type="text/javascript" src="/js/jQuery.js"></script> <!-- Load jQuery Library -->
        <script type="text/javascript" src="/js/cParse.js"></script> <!-- Load Code Parser Library -->
    </head>
    <body>
        <?php include_once('../app_incl/header.php'); ?> <!-- PAGE HEADER -->

        <div class="content">
            <p class="header">CSS Position</p>
            <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent laoreet orci in elementum lobortis. <a>Pellentesque sollicitudin</a> vulputate libero, a ultrices urna accumsan quis. Morbi id vehicula nunc, ac vulputate turpis. Morbi ornare dolor eget tortor tempor dapibus. Duis in pellentesque magna. Donec quis mollis leo, quis molestie libero. Vestibulum quis tincidunt massa, at posuere mauris. Vivamus aliquam justo viverra, laoreet sapien sed, tincidunt velit. Nullam at elementum mi, sit amet tincidunt nibh. Mauris mattis quam sit amet justo molestie ornare. Mauris viverra, quam at convallis laoreet, ligula felis rutrum velit, eget interdum purus purus faucibus leo. Duis mauris neque, bibendum in vulputate at, euismod at eros. Proin mollis turpis magna, quis lobortis velit porta a. Aenean malesuada rhoncus quam, a luctus ligula posuere at. In quis iaculis enim, sed convallis lorem.</p>
            <p class="paragraph">
                Cras sed aliquet felis, sed tempus felis. Nam dui lorem, commodo et orci quis, finibus aliquam nibh.
                
                <code class="line" lang="js">var hvac = 'Hello World!';</code>

                Cras laoreet neque quis vulputate tristique. Quisque gravida pulvinar tortor, a euismod mi commodo et. Fusce hendrerit, quam at tincidunt pulvinar, elit justo imperdiet est, et cursus lorem turpis non risus. Donec mattis congue velit non sagittis. Suspendisse potenti. Fusce vitae mi in libero viverra auctor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla aliquet finibus arcu sit amet consequat.
            </p>

            <code class="block" lang="js">
                function pageOneComplete(e) {
                    var name = $('.p1n').val();
                    var email = $('.p1e').val();
                    var role = $('.p1r').val();
                    let testing = "var name = $('.p1n').val();";

                    var error = false;
                    if(testing == '') foo();
                    if(name == '' || name.length > 240) { textInputError($('.p1n').get(0)); error = true; }
                    if(email == '' || email.length > 240 || !validateEmail(email)) { textInputError($('.p1e').get(0)); error = true; }
                    if(role == '' || role.length > 240) { textInputError($('.p1r').get(0)); error = true; }

                    e.preventDefault();

                    if(!error) {
                        $('.pageOne').fadeOut(300);
                        $('.pageTwo').delay(300).fadeIn(300);
                        popupResizeUpdatePosition(true); // Update All Popup Positions
                    }
                }

                function pageTwoComplete(e) {
                    var sharekey = $('.p2s').val();
                    var time = $('.p2t').val();

                    var error = false;
                    if(sharekey.length != 6 || !/^\d+$/.test(sharekey)) { textInputError($('.p2s').get(0)); error = true; }
                    if(time == '') { textInputError($('.p2t').get(0)); error = true; }

                    e.preventDefault();

                    if(!error) {
                        $('.pageTwo').fadeOut(300);
                        $('.blackoutLoader').fadeIn(300);

                        var postData = {
                            adminName: $('.p1n').val(),
                            adminEmail: $('.p1e').val(),
                            adminRole: $('.p1r').val(),
                            churchShare: $('.p2s').val(),
                            churchTime: $('.p2t').val()
                        };

                        setTimeout(function() {
                            httpPost(
                                location.href, 'data=' + encodeURIComponent(JSON.stringify(postData)),
                                function(json) {
                                    if(validJSON(json)) {
                                        json = JSON.parse(json);
                                        if(json.success == true) {
                                            $('.blackoutLoader').fadeOut(300);
                                            $('.pageSuccess').fadeIn(300);
                                            popupResizeUpdatePosition(true); // Update All Popup Positions
                                        } else {
                                            $('.blackoutLoader').fadeOut(300);
                                            $('.pageOne').fadeIn(300);
                                            popupResizeUpdatePosition(true); // Update All Popup Positions
                                            messageBanner('red', 'An error occoured!', json.message, null, 10);
                                        }
                                    } else {
                                        console.log(json);
                                        $('.blackoutLoader').fadeOut(300);
                                        $('.pageOne').fadeIn(300);
                                        popupResizeUpdatePosition(true); // Update All Popup Positions
                                        messageBanner('red', 'An error occoured!', 'There was an error that we cannot identify right now.', null, 10);
                                    }
                                }
                            );
                        }, 1000);
                    }
                }

                $(function() {
                    $('.pageOne').delay(300).fadeIn(300);
                });
            </code>
            <p class="paragraph">Aliquam dapibus lacus a tempor aliquam. Quisque at vestibulum justo, rutrum gravida nulla. In dapibus egestas lacinia. Nullam lobortis justo vel nisl aliquam, nec fringilla enim ultrices. Integer ut tortor a dolor euismod posuere non at arcu. Nunc efficitur lobortis tortor, ac congue nibh faucibus nec. Ut nec ipsum eget justo posuere congue.</p>
            <img class="image" src="/temp/wide-image.jpg" />
            <p class="paragraph">Curabitur tincidunt ex eu orci accumsan, ut blandit metus efficitur. Nunc hendrerit ligula leo, eget molestie diam rutrum quis. Nulla tempor varius varius. Pellentesque a tellus a velit consectetur varius. Fusce ultrices sit amet est ut pretium. Vestibulum gravida, eros sed fermentum tincidunt, enim nibh commodo diam, semper consequat neque sapien at nibh. Curabitur at venenatis tellus. Proin lobortis sodales elit, a pulvinar metus. Nam pretium magna mauris, elementum dictum ante sollicitudin sit amet. Sed felis est, vestibulum vitae vehicula a, gravida a felis. Nulla rhoncus fermentum laoreet. Integer faucibus, libero id fringilla finibus, est augue efficitur nibh, vel tempor magna nunc in lectus.</p>
            <p class="published">Published 2020-01-30 20:40 by <a href="#">Esaias Tilly</a></p>
        </div>
    </body>
</html>