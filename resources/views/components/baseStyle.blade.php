<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css"/>
<link type="text/css" rel="stylesheet" href="{{ asset('plugins/sweetalert2/css/sweetalert2.min.css') }}"/>

<link type="text/css" rel="stylesheet" href="{{ asset('css/common_v3.css') }}?v={{ config('site.default.asset_version') }}"/>

<link type="text/css" rel="stylesheet" href="{{ asset('css/base.css') }}?v={{ config('site.default.asset_version') }}">


{{--addStyle--}}
@yield('addStyle')
