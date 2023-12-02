<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
//use Laravel\Passport\Passport;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
//        $this->registerPolicies();
//        // 토큰 유효기간
//        Passport::tokensExpireIn(now()->addHours(12));
//
//        // refresh token
//        Passport::refreshTokensExpireIn(now()->addDays(60));
//
//        // personalAccessToken
//        Passport::personalAccessTokensExpireIn(now()->addHours(6));

        Auth::viaRequest('custom-token', function (Request $request) {
            return User::where('token', $request->token)->first();
        });
    }
}
