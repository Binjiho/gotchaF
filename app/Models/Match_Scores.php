<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Match_Scores extends Model
{
    use HasFactory;

    protected $table='match_scores';

    public $timestamps = false; // timestamps 활성화 여부 (created_at 및 updated_at 컬럼)

    protected $primaryKey='sid';

    //guarded 금지목록
    protected $guarded = [
        'sid',
    ];

    //fillable 허용목록
    protected $fillable = [
        'mid',
        'tid',
        'round',
        'step',
        'score',
        'del_yn',
    ];
}
