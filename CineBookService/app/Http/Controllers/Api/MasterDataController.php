<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MasterData\Queries\MasterDataQuery;
use Illuminate\Http\JsonResponse;

class MasterDataController extends Controller
{
    public function index(MasterDataQuery $masterDataQuery): JsonResponse
    {
        return response()->json([
            'data' => $masterDataQuery->get(),
        ]);
    }
}
