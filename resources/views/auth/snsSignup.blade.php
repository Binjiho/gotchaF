<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Hello</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
</head>
<body class="antialiased">
<div>
    this is for sns login blade

    <ul class="inputArea">
        <li>
            <label class="hidden">[provider] snstype</label>
            <h1>{{ $provider }}</h1>
        </li>

    </ul>

</div>
</body>
</html>
