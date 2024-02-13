<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Competition_Team extends Model
{
    use HasFactory;

    protected $table='competition_teams';

    public $timestamps = false; // timestamps 활성화 여부 (created_at 및 updated_at 컬럼)

    protected $primaryKey='sid';

    //guarded 금지목록
    protected $guarded = [
        'sid',
    ];

    //fillable 허용목록
    protected $fillable = [
        'cid',
        'tid',
        'level',
        'tot_score'
    ];
}
