<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    use HasFactory;

    protected $table='matches';

    public $timestamps = false; // timestamps 활성화 여부 (created_at 및 updated_at 컬럼)

    protected $primaryKey='sid';

    //guarded 금지목록
    protected $guarded = [
        'sid',
    ];

    //fillable 허용목록
    protected $fillable = [
        'cid',
        'type',
        'tid1',
        'tid2',
        't1_score',
        't2_score',
        'total_step',
        'round',
        'order',
        'state',
        'matched_at',
        'del_yn',
    ];
}
