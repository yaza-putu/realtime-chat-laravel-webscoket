<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CheckRoomTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_check_room()
    {
        User::factory(1)->create();
        $user = User::limit(2)->get();

        $this->actingAs($user[0]);

        $response = $this->getJson("room/check" . '/' . $user[1]->id);
        $response->assertStatus(200);
    }
}
