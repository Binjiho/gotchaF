@extends('layouts.auth.layout')

@section('addStyle')
@endsection

@section('contents')
    <div class="contents">
{{--        @include('layouts.web.include.subTit')--}}
        <h3 class="subTit">login</h3>

        <div class="login">
            <h4>로그인</h4>

            <form id="login-frm" action="/api/auth/login" method="post">
                <fieldset>
                    <legend>로그인</legend>

                    <ul class="inputArea">
                        <li>
                            <label class="hidden">이메일</label>
                            <input type="text" name="email" placeholder="email 입력하여 주세요." noneSpace>
                        </li>
                        <li>
                            <label class="hidden">비밀번호</label>
                            <input type="password" name="password" placeholder="비밀번호를 입력하여 주세요." noneSpace>
                        </li>
                    </ul>
                    <p class="loginUtil">
                        <a href="/auth/forgot"><img src="/image/sub/login_find.png" alt="">아이디/비밀번호 찾기</a>
                    </p>

                    <div class="btn">
                        <input type="submit" value="로그인">
                        <a href="/auth/register/step1">회원가입</a>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
@endsection

@section('addScript')
    <script src="{{ asset('plugins/jquery-validation/jquery.validate.min.js') }}"></script>
    <script>
        const form = '#login-frm';

        defaultVaildation();

        $(form).validate({
            rules: {
                uid: {
                    isEmpty: true,
                },
                password: {
                    isEmpty: true,
                },
            },
            messages: {
                uid: {
                    isEmpty: '아이디를 입력해주세요.',
                },
                password: {
                    isEmpty: '비밀번호를 입력해주세요.',
                },
            },
            submitHandler: function () {
                callAjax($(form).attr('action'), formSerialize(form), true);
            }
        });
    </script>
@endsection
