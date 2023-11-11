<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
//        'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
        // 토큰 유효기간
        Passport::tokensExpireIn(now()->addHours(12));

        // refresh token
        Passport::refreshTokensExpireIn(now()->addDays(60));

        // personalAccessToken
        Passport::personalAccessTokensExpireIn(now()->addHours(6));
    }
}
