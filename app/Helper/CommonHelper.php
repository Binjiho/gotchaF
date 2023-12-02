<?php

//require_once('SiteHelper.php');

// get u_sid
if (!function_exists('get_usid')) {
    function get_usid()
    {
        return thisAuth()->id() ?? 0;
    }
}

if (!function_exists('thisAuth')) {
    function thisAuth()
    {
        return (CheckUrl() === 'admin')
            ? auth('admin')
            : auth();
    }
}

if (!function_exists('CheckUrl')) {
    function CheckUrl(): string
    {
        if (strContains(request()->getUri(), config('site.default.api.url'))) {
            return 'api';
        }

        if (strContains(request()->getUri(), config('site.default.admin.url'))) {
            return 'admin';
        }

        if (strContains(request()->getUri(), config('site.default.web_en.url'))) {
            return 'web_en';
        }

        return 'web';
    }
}

if (!function_exists('strContains')) {
    function strContains($haystack, $needle)
    {
        return (strpos($haystack, $needle) !== false);
    }
}

if (!function_exists('setFlashData')) {
    function setFlashData(array $data): void
    {
        foreach ($data as $key => $val) {
            request()->session()->flash($key, $val);
        }
    }
}

if (!function_exists('setFlashMessage')) {
    function setFlashMessage(string $code): void
    {
        $config = (CheckUrl() === 'web_en')
            ? config('site.error.en')
            : config('site.error');

        setFlashData($config[$code] ?? ['msg' => $code]);
    }
}

if (!function_exists('getErrorMessage')) {
    function getErrorMessage(string $code): string
    {
        return (CheckUrl() === 'web_en')
            ? config('site.error.en')[$code]['msg']
            : config('site.error')[$code]['msg'];
    }
}

if (!function_exists('redirectCase')) {
    function redirectCase(string $case1, string $case2 = null): array
    {
        /*
         * $case1 & $case2 값 => replace, reload, back, auth
         * $case1 과 $case2 값이 모두 있을경우 $case1 은 ajax 일경우 $case2는 아닐경우
         * 보통은 $case1 만 쓰지만 접근방법이 ajax와 url 접근 모두 허용할경우 $case2 사용
         */

        return (empty($case2))
            ? ['redirect' => $case1]
            : ['redirect' => request()->ajax() ? $case1 : $case2];
    }
}

if (!function_exists('errorNotFoundRedirect')) {
    function errorNotFoundRedirect(string $case = '')
    {
        if(empty($case)) {
            $case = redirectCase('reload', 'back');
        }

        setFlashMessage('404');
        return callRedirect($case);
    }
}

if (!function_exists('errorServerRedirect')) {
    function errorServerRedirect($case = '')
    {
        if(empty($case)) {
            $case = redirectCase('reload', 'back');
        }

        setFlashMessage('500');
        return callRedirect($case);
    }
}

if (!function_exists('errorDBRedirect')) {
    function errorDBRedirect($case = '')
    {
        if(empty($case)) {
            $case = redirectCase('reload', 'back');
        }

        setFlashMessage('db');
        return callRedirect($case);
    }
}

if (!function_exists('authRedirect')) {
    function authRedirect()
    {
        setFlashMessage('auth');
        return callRedirect('auth');
    }
}

if (!function_exists('setRedirect')) {
    function setRedirect(array $case, string $code, string $url = '')
    {
        setFlashMessage($code);

        if (!empty($url)) {
            setFlashData(['url' => $url]);
        }

        return redirectCase($case[0], $case[1] ?? '');
    }
}

if (!function_exists('callRedirect')) {
    function callRedirect($case)
    {
        if (is_array($case)) {
            $case = $case['redirect'];
        }

        switch ($case) {
            case 'auth':
                return (request()->ajax())
                    ? response()->json([
                        'alert' => [
                            'case' => true,
                            'msg' => session()->pull('msg'),
                            'location' => ['case' => 'replace', 'url' => route(getDefaultRedirect(true))]
                        ]
                    ])
                    : redirect()->route(getDefaultRedirect(true))->with(['msg' => session()->pull('msg')]);

            case 'back':
                return (request()->ajax())
                    ? response()->json([
                        'alert' => [
                            'case' => true,
                            'msg' => session()->pull('msg'),
                            'location' => ['case' => $case]
                        ]
                    ])
                    : redirect()->back()->with(['msg' => session()->pull('msg')]);

            case 'replace':
                return (request()->ajax())
                    ? response()->json([
                        'alert' => [
                            'case' => true,
                            'msg' => session()->pull('msg'),
                            'location' => ['case' => $case, 'url' => (session()->pull('url') ?? route(getDefaultRedirect()))]
                        ]
                    ])
                    : redirect((session()->pull('url') ?? route(getDefaultRedirect())))->with(['msg' => session()->pull('msg')]);

            case 'reload':
                if (request()->ajax()) {
                    return response()->json([
                        'alert' => [
                            'case' => true,
                            'msg' => session()->pull('msg'),
                            'location' => ['case' => $case]
                        ]
                    ]);
                }

                echo "<script>alert('" . session()->pull('msg') . "'); window.location.reload();</script>";
                break;

            default:
                return (request()->ajax())
                    ? response()->json([
                        'alert' => [
                            'case' => true,
                            'msg' => session()->pull('msg'),
                            'location' => ['case' => 'replace', 'url' => route(getDefaultRedirect())]
                        ]
                    ])
                    : redirect()->route(getDefaultRedirect())->with(['msg' => session()->pull('msg')]);
        }
    }
}

// crypto-js decrypt
if (!function_exists('cryptoDecrypt')) {
    function cryptoDecrypt(\Illuminate\Http\Request $request)
    {
        $password = 'secret phrase';

        foreach (request()->all() as $key => $val) {
            if (gettype($val) === 'string') {
                $cipherText = base64_decode($val);

                if (substr($cipherText, 0, 8) != "Salted__") {
                    continue;
                }

                $salt = substr($cipherText, 8, 8);
                $keyAndIV = evpKDF($password, $salt);

                $request[$key] = openssl_decrypt(
                    substr($cipherText, 16),
                    "aes-256-cbc",
                    $keyAndIV["key"],
                    OPENSSL_RAW_DATA, // base64 was already decoded
                    $keyAndIV["iv"]
                );
            }
        }

        return $request;
    }
}

// crypto-js decrypt return key And IV
if (!function_exists('evpKDF')) {
    function evpKDF(string $password, string $salt, $keySize = 8, $ivSize = 4, $iterations = 1, $hashAlgorithm = "md5")
    {
        $targetKeySize = $keySize + $ivSize;
        $derivedBytes = "";
        $numberOfDerivedWords = 0;
        $block = NULL;
        $hasher = hash_init($hashAlgorithm);

        while ($numberOfDerivedWords < $targetKeySize) {
            if (!empty($block)) {
                hash_update($hasher, $block);
            }

            hash_update($hasher, $password);
            hash_update($hasher, $salt);

            $block = hash_final($hasher, true);
            $hasher = hash_init($hashAlgorithm);

            // Iterations
            for ($i = 1; $i < $iterations; $i++) {
                hash_update($hasher, $block);
                $block = hash_final($hasher, true);
                $hasher = hash_init($hashAlgorithm);
            }

            $derivedBytes .= substr($block, 0, min(strlen($block), ($targetKeySize - $numberOfDerivedWords) * 4));
            $numberOfDerivedWords += strlen($block) / 4;
        }

        return [
            "key" => substr($derivedBytes, 0, $keySize * 4),
            "iv" => substr($derivedBytes, $keySize * 4, $ivSize * 4)
        ];
    }
}

// set seq
if (!function_exists('setSeq')) {
    function setSeq(object $data)
    {
        $count = 0;
        $total = count($data);

        // seq 라는 순번 필드를 추가
        foreach ($data as $key => $row) {
            $data[$key]->seq = $total - $count;
            $count++;
        }

        return $data;
    }
}

// set list seq (paging 있을때)
if (!function_exists('setListSeq')) {
    function setListSeq(object $data)
    {
        $count = 0;
        $total = $data->total();
        $perPage = $data->perPage();
        $currentPage = $data->currentPage();

        // seq 라는 순번 필드를 추가
        $data->getCollection()->transform(function ($data) use ($total, $perPage, $currentPage, &$count) {
            $data->seq = ($total - ($perPage * ($currentPage - 1))) - $count;
            $count++;
            return $data;
        });

        return $data;
    }
}

// create Zip File
if (!function_exists('setZipFile')) {
    function setZipFile($data = [], string $file_name)
    {
        $zip = new \ZipArchive();

        // 다운로드될 zip 파일 명
        $file['file_name'] = $file_name;

        // zip 아카이브 생성하기 위한 고유값
        $file['file'] = time() . ".zip";

        // zip 아카이브 생성 여부 확인
        if($zip->open($file['file'], \ZipArchive::CREATE) !== true){
            setFlashMessage('500');
            return redirectCase('default');
        }

        // addFile ( 파일이 존재하는 경로, 저장될 이름 )
        foreach ($data as $row) {
            $zip->addFile(public_path($row->file_path), $row->file_name);
        }

        // 아카이브 닫아주기
        $zip->close();

        return $file;
    }
}

// jsonUnicode 적용
if (!function_exists('jsonUnicode')) {
    function jsonUnicode($aray = [])
    {
        return json_encode($aray, JSON_UNESCAPED_UNICODE);
    }
}

// 숫자 콤마 제거
if (!function_exists('unComma')) {
    function unComma(string $num)
    {
        return (int)str_replace(',', '', $num);
    }
}

// 날짜별 요일
if (!function_exists('getYoil')) {
    function getYoil(string $date)
    {
        $yoil = array('일', '월', '화', '수', '목', '금', '토');
        return $yoil[date('w', strtotime($date))];
    }
}

// date String
if (!function_exists('isDateEmpty')) {
    function isDateEmpty($date = null)
    {
        return (empty($date)) ? true : (strtotime($date) < 0);
    }
}

// mobile check
if (!function_exists('mobileCheck')) {
    function mobileCheck()
    {
        $agent = new \Jenssegers\Agent\Agent;
        return ($agent->isMobile() || $agent->isTablet());
    }
}

if (!function_exists('customDump')) {
    /**
     * @return never
     */
    function customDump(...$vars)
    {
        if (!in_array(\PHP_SAPI, ['cli', 'phpdbg'], true) && !headers_sent()) {
            header('HTTP/1.1 500 Internal Server Error');
        }

        foreach ($vars as $v) {
            \Symfony\Component\VarDumper\VarDumper::dump($v);
        }
    }
}
