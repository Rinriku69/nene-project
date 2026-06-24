<?php

namespace App\Http\Controllers;

use App\Models\User;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use MessageFormatter;

class ProfileController extends Controller
{
    function uploadProfile(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image'
        ]);
        $user = Auth::user();

        $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));

        try {

            $result = $cloudinary->uploadApi()->upload(
                $request->file('avatar')->getRealPath(),
                [
                    'upload_preset' => 'profile_pictures'
                ]
            );

            $secureUrl = $result['secure_url'];

            $updateUser = User::find($user->id);
            $updateUser->update(['image_url' => $secureUrl]);

            return response()->json([
                'message' => 'Profile Upload sucess',
                'url' => $secureUrl
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Upload Fail'
            ], 400);
        }
    }
}
