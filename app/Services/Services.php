<?php

namespace App\Services;

use App\Models\QueryLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Class Services
 * @package App\Services
 */
class Services
{
    protected $data = [];
    protected $jsonData = [];

    protected function transaction(): void
    {
        DB::beginTransaction();
        DB::enableQueryLog();
    }

    protected function dbCommit(string $subject, string $msg = ''): void
    {
        DB::commit();

        if(!empty($msg)) {
            setFlashData(['msg' => $msg]);
        }

//        QueryLog::create([
//            'u_sid' => get_usid(),
//            'subject' => $subject,
//            'query' => jsonUnicode(DB::getQueryLog()),
//            'ip' => getIp()
//        ]);
    }

    protected function dbRollback($msg,$error)
    {
        DB::rollback();
        Log::channel('custom_error')->error("================================== DB ERROR ===================================");
        Log::channel('custom_error')->error($error);
        Log::channel('custom_error')->error("===============================================================================");

        return response()->json([
                'message' => $msg,
                'error' => $error,
        ]);
//        return errorDBRedirect();
    }
    protected function setJsonData($data, $value = ''): void
    {
        if (!is_array($data)) {
            $this->jsonData[$data] = $value;
        } else {
            foreach ($data as $key => $val) {
                $this->jsonData[$key] = $val;
            }
        }
    }

    protected function returnJson(): array
    {
        return $this->jsonData;
    }

    protected function returnJsonData($data, $value): array
    {
        $this->setJsonData($data, $value);
        return $this->returnJson();
    }

}
