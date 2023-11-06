{{-- Scripts --}}
<script src="{{ asset('script/jquery.1.9.0.js') }}"></script>
<script src="{{ asset('script/jquery-ui.min.js') }}"></script>
<script src="{{ asset('script/jquery.bxslider.min.js') }}"></script>
<script src="{{ asset('plugins/crypto-js/4.1.1/crypto-js.min.js') }}"></script>
<script src="{{ asset('plugins/sweetalert2/js/sweetalert2.min.js') }}"></script>

<script src="{{ asset('script/app/app.common.js') }}?v={{ config('site.default.asset_version') }}"></script>

@if(session()->has('msg'))
    <script>
        actionAlert({
            'case': true,
            'msg': '{!! session()->pull("msg") !!}',
            'location': {'case': 'reload'},
        });
    </script>
@endif

