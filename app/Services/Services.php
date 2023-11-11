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

        QueryLog::create([
            'u_sid' => get_usid(),
            'subject' => $subject,
            'query' => jsonUnicode(DB::getQueryLog()),
            'ip' => getIp()
        ]);
    }

    protected function dbRollback($error)
    {
        DB::rollback();
        Log::channel('custom_error')->error("================================== DB ERROR ===================================");
        Log::channel('custom_error')->error($error);
        Log::channel('custom_error')->error("===============================================================================");

        return errorDBRedirect();
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

    protected function ajaxActionHtml(string $selector, string $html)
    {
        return ['selector' => $selector, 'html' => $html];
    }

    protected function ajaxActionCss(string $selector, string $css, string $val = '')
    {
        return ['selector' => $selector, 'css' => $css, 'val' => $val];
    }

    protected function ajaxActionClass(string $selector, string $class)
    {
        return ['selector' => $selector, 'class' => $class];
    }

    protected function ajaxActionInput(string $selector, string $input)
    {
        return ['selector' => $selector, 'input' => $input];
    }

    protected function ajaxActionText(string $selector, string $text)
    {
        return ['selector' => $selector, 'text' => $text];
    }

    protected function ajaxActionAttr(string $selector, string $attr, string $val)
    {
        return ['selector' => $selector, 'attr' => $attr, 'val' => $val];
    }

    protected function ajaxActionData(string $selector, string $name, string $data)
    {
        return ['selector' => $selector, 'name' => $name, 'data' => $data];
    }

    protected function ajaxActionFunction(string $body, string $argS, array $argV)
    {
        return ['body' => $body, 'argS' => $argS, 'argV' => $argV];
    }

    protected function ajaxActionTrigger(string $selector, string $event)
    {
        return ['selector' => $selector, 'event' => $event];
    }

    protected function ajaxActionProp(string $selector, string $event, bool $val)
    {
        return ['selector' => $selector, 'event' => $event, 'val' => $val];
    }

    protected function ajaxActionRemove(string $selector)
    {
        return ['selector' => $selector];
    }

    protected function ajaxActionSubmit(string $selector, string $url = '')
    {
        return ['selector' => $selector, 'action' => $url];
    }

    protected function ajaxActionLocation(string $case, string $url = '')
    {
        return ['case' => $case, 'url' => $url];
    }

    protected function ajaxActionWinClose(bool $bool = false)
    {
        return ['reload' => $bool];
    }
}
