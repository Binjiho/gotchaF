@php

@endphp

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--[if IE 7]>
<html xmlns="http://www.w3.org/1999/xhtml" lang="eng" xml:lang="eng" class="ie7"><![endif]-->
<!--[if IE 8]>
<html xmlns="http://www.w3.org/1999/xhtml" lang="eng" xml:lang="eng" class="ie8"><![endif]-->
<!--[if IE 9]>
<html xmlns="http://www.w3.org/1999/xhtml" lang="eng" xml:lang="eng" class="ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html xmlns="http://www.w3.org/1999/xhtml" lang="eng" xml:lang="eng"><!--<![endif]-->

<head>
    @include('components.baseHead')
</head>
<body>

<div class="wrapper">
    @include('layouts.auth.include.header')
    <hr/>

    <!--
        메인 class="main"
        회원메뉴 class="sub01"
        마이페이지 class="sub02"
        학회소개 class="sub03"
        공지사항 class="sub04"
        학회지 class="sub05"
        학술행사 class="sub06"
        전공의 class="sub07"
        체외순환사 class="sub08"
        학회자료 class="sub09"
        위원회/분과학회 class="sub10"
        회원공간 class="sub11"
    -->
    <div id="container" class="main_container">
        @yield('contents')
        <!-- contents -->
    </div>
    <!-- container -->
    <hr/>
</div>
<!-- //wrapper -->
@yield('addScript')
</body>
</html>
