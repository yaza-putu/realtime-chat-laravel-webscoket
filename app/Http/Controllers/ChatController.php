<?php

namespace App\Http\Controllers;

use App\Events\SendMessage;
use App\Models\Message;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index()
    {
        $data["users"] = User::whereNot("id", auth()->user()->id)->get();
        return view("chat", $data);
    }

    public function saveChat(Request $request)
    {
        Message::create([
            "user_id" => auth()->user()->id,
            "message" => $request->message,
            "room_id" => $request->room_id,
        ]);

        broadcast(new SendMessage($request->message, $request->room_id, auth()->user()->id));
        return response()->json([
            "success" => true
        ]);
    }

    public function loadingMessage(Request $request, $room_id)
    {
        $result = Message::where("room_id", $room_id)->orderBy("updated_at", "asc")->get();
        return response()->json([
            "success" => true,
            "data" => $result
        ]);
    }

    public function getHistoryMessage()
    {
        // get all rooms
        $rooms = Room::where("users", "LIKE", "%".auth()->user()->id."%")->get(["id"])
            ->map(function ($data){
                return $data->id;
            });

        $messages = Message::whereIn("room_id", $rooms)
                        ->with("user")
                        ->whereNot("user_id", auth()->user()->id)
                        ->groupBy("user_id")
                        ->get();

        return response()->json([
            "success" => true,
            "data" => $messages
        ]);
    }
}
