<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team_User extends Model
{
    use HasFactory;

    protected $table='team_users';

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
        'level',
    ];

//    public function user()
//    {
//        return $this->belongsTo(User::class,'uid','sid');
//    }
}
