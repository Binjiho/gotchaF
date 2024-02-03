<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competition extends Model
{
    use HasFactory;

    protected $table='competitions';

    public $timestamps = false; // timestamps 활성화 여부 (created_at 및 updated_at 컬럼)

    protected $primaryKey='sid';

    //guarded 금지목록
    protected $guarded = [
        'sid',
    ];

    //fillable 허용목록
    protected $fillable = [
        'tid',
        'uid',
        'kind',
        'type',
        'state',
        'title',
        'contents',
        'region',
        'limit_team',
        'person_vs',
        'frequency',
        'yoil',
        'regist_edate',
        'event_sdate',
        'event_edate',
        'sex',
        'min_age',
        'max_age',
        'file_originalname',
        'file_realname',
        'file_path',
    ];
}
