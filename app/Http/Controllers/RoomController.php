<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function checkRoom(Request $request, $user_id)
    {
        $me = auth()->user()->id;
        $roomId = null;

        $user = User::findOrFail($user_id);

        $room = Room::where("users", "$user_id:$me")
                    ->orWhere("users", "$me:$user_id")
                    ->first();

        if($room) {
            $roomId = $room->id;
        } else {
            $newRoom = Room::create([
                "users" => "$me:$user_id"
            ]);
            $roomId = $newRoom->id;
        }

        return response()->json([
            "success" => true,
            "data" => [
                "user" => $user,
                "me" => $me,
                "room_id" => $roomId
            ]
        ]);
    }
}
