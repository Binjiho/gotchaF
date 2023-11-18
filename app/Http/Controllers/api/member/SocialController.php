<?php

namespace App\Http\Controllers\api\member;

use Illuminate\Routing\Controller as BaseController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends BaseController
{
    public function login(string $provider)
    {
        if (!array_key_exists($provider, config('services'))) {
            return redirect('login')->with('error', $provider . ' is not supported.');
        }
        return Socialite::driver($provider)
            ->redirect();
    }

    public function callback_test(String $provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();

        return response()->json($socialUser);

        // Find User
        $user = User::where([
            'email'=> $socialUser->getEmail()
        ])->first();

        if($user){
            return redirect()->route('login');
        }

        return response()->json($socialUser->getEmail());
    }

    public function callback(String $provider)
    {
        try{
            $socialUser = Socialite::driver($provider)->user();

            $socialAccount = SocialAccount::where([
                'provider_name' => $provider,
                'provider_id'   => $socialUser->id
            ])->first();

            // If Social Account Exist then Find User and Login
            if($socialAccount){
                $socialAccount->update([
                    'token' => $socialUser->token,
                ]);

                Auth::login($socialAccount->user);
                return redirect()->route('dashboard');
            }

            // Find User
            $user = User::where([
                'email'=> $socialUser->getEmail()
            ])->first();

            if(!$user){
                if ($socialUser->getName()){
                    $name = $socialUser->getName();
                } else {
                    $name = $socialUser->getNickName();
                }

                $user = User::create([
                    'email'=>$socialUser->getEmail(),
                    'name' =>$name,
                    'profile_photo_path' => $socialUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
            }

            // Create Social Accounts
            $user->socialAccounts()->create([
                'provider_name' => $provider,
                'name'          => $socialUser->name,
                'email'         => $socialUser->email,
                'provider_id'   => $socialUser->id,
                'token'         => $socialUser->token,
            ]);

            Auth::login($user);
            return redirect()->route('dashboard');

        }catch(\Exception $e){
            return redirect()->route('login');
        }
    }

}
