<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $locations = Location::where('is_active', true)
            ->orderBy('city')
            ->orderBy('name')
            ->get();

        return Inertia::render('Customer/Locations', [
            'locations' => $locations,
        ]);
    }
}
