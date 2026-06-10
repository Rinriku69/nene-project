<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        /*  User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
        ]);
 */
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@default.com')], 
            [
                'username' => 'admin_pooh',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'role' => 'admin',
                'currency' => 999999 
            ]
        );

        $this->call([
            ItemSeeder::class,
        ]);
    }
}
