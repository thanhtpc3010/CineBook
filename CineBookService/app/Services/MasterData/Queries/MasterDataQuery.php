<?php

namespace App\Services\MasterData\Queries;

use Illuminate\Support\Facades\DB;

class MasterDataQuery
{
    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function get(): array
    {
        $movieGenreIds = DB::table('moviegenres')
            ->select(['movieid', 'genreid'])
            ->orderBy('movieid')
            ->orderBy('genreid')
            ->get()
            ->groupBy('movieid')
            ->map(fn ($rows): array => $rows->pluck('genreid')->map(fn ($id): int => (int) $id)->all());

        return [
            'cities' => $this->rows(DB::table('cities')->orderBy('cityname')->get()),
            'theaters' => $this->rows(DB::table('theaters')->orderBy('theatername')->get()),
            'screens' => $this->rows(DB::table('screens')->orderBy('screenname')->get()),
            'seatcategories' => $this->rows(DB::table('seatcategories')->orderBy('categoryname')->get()),
            'seats' => $this->rows(DB::table('seats')->orderBy('screenid')->orderBy('rowname')->orderBy('seatnumber')->get()),
            'genres' => $this->rows(DB::table('genres')->orderBy('genrename')->get()),
            'movies' => $this->rows(DB::table('movies')->orderByDesc('releasedate')->get(), function (array $movie) use ($movieGenreIds): array {
                $movie['genreids'] = $movieGenreIds->get($movie['movieid'], []);

                return $movie;
            }),
        ];
    }

    /**
     * @param  iterable<object>  $rows
     * @param  null|callable(array<string, mixed>): array<string, mixed>  $transform
     * @return array<int, array<string, mixed>>
     */
    private function rows(iterable $rows, ?callable $transform = null): array
    {
        return collect($rows)
            ->map(function (object $row) use ($transform): array {
                $values = (array) $row;

                $values = $transform ? $transform($values) : $values;

                return $this->normalize($values);
            })
            ->all();
    }

    /**
     * @param  array<string, mixed>  $values
     * @return array<string, mixed>
     */
    private function normalize(array $values): array
    {
        foreach (['cityid', 'theaterid', 'screenid', 'categoryid', 'seatid', 'genreid', 'movieid', 'durationminutes', 'seatnumber', 'totalscreens', 'totalseats', 'status'] as $key) {
            if (array_key_exists($key, $values) && $values[$key] !== null) {
                $values[$key] = (int) $values[$key];
            }
        }

        if (array_key_exists('basepricemultiplier', $values) && $values['basepricemultiplier'] !== null) {
            $values['basepricemultiplier'] = (float) $values['basepricemultiplier'];
        }

        if (array_key_exists('isactive', $values) && $values['isactive'] !== null) {
            $values['isactive'] = in_array($values['isactive'], [true, 1, '1', 't', 'true'], true);
        }

        return $values;
    }
}
