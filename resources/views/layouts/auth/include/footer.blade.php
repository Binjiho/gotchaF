@php($infoConfig = config('site.default.info'))

<div id="footerWrap">
    <ul class="footerMenu">
        <li><a href="{{ route('auth.privacy') }}">개인정보 취급방침</a></li>
        <li><a href="{{ route('auth.email') }}">이메일 무단수집 거부</a></li>
    </ul>

    <p>Copyright ⓒ The Korean Society for Thoracic & Cardiovascular Surgery. All rights reserved.</p>
    <ul class="footerInfo">
        <li><address>사무국 [{{ $infoConfig['zipcode'] }}] {{ $infoConfig['addr'] }}</address></li>
        <li><span>TEL :</span> {{ $infoConfig['multi_tel'] }}</li>
        <li><span>FAX :</span> {{ $infoConfig['fax'] }}</li>
        <li><span>E-mail :</span> <a href="mailto:{{ $infoConfig['email'] }}">{{ $infoConfig['email'] }}</a></li>
    </ul>

    <dl>
        <dt><span>헤이헤이헤이</span></dt>
        <dd>
            <ul class="footerInfo">
                <li><span>TEL :</span> 031-4231-1234</li>
                <li><span>E-mail :</span> office@123urg.org</li>
            </ul>
        </dd>
    </dl>

    <ul class="footerInfo">
        <li><span>사업장명:</span> {{ env('APP_NAME') }}</li>
        <li><span>대표자명:</span> 나야</li>
        <li><span>사업자번호:</span> 110-82-06710</li>
    </ul>
</div>
<!-- //footerWrap -->
