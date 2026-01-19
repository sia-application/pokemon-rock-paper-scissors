document.addEventListener('DOMContentLoaded', () => {
    console.log('Pokemon Janken App Loaded');

    // -- Data --
    const pokemonData = [
        { id: 1, name: 'フシギダネ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 4, name: 'ヒトカゲ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 6, name: 'リザードン', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 7, name: 'ゼニガメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
        { id: 25, name: 'ピカチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 66, name: 'ワンリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
        { id: 74, name: 'イシツブテ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
        { id: 63, name: 'ケーシィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
        { id: 16, name: 'ポッポ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
        { id: 27, name: 'サンド', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
        { id: 131, name: 'ラプラス', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png' },
        { id: 92, name: 'ゴース', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
        { id: 149, name: 'カイリュー', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 130, name: 'ギャラドス', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' },
        { id: 143, name: 'カビゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
    ];

    const typeChart = {
        // key: attacker, value: { defender: multiplier }
        // 2 = WIN, 0.5 = LOSE, 0 = LOSE (No effect)
        'fire': { 'grass': 2, 'ice': 2, 'bug': 2, 'steel': 2, 'water': 0.5, 'rock': 0.5, 'dragon': 0.5, 'fire': 0.5 },
        'water': { 'fire': 2, 'ground': 2, 'rock': 2, 'water': 0.5, 'grass': 0.5, 'dragon': 0.5 },
        'grass': { 'water': 2, 'ground': 2, 'rock': 2, 'fire': 0.5, 'grass': 0.5, 'poison': 0.5, 'flying': 0.5, 'bug': 0.5, 'dragon': 0.5, 'steel': 0.5 },
        'electric': { 'water': 2, 'flying': 2, 'electric': 0.5, 'grass': 0.5, 'dragon': 0.5, 'ground': 0 },
        'ice': { 'grass': 2, 'ground': 2, 'flying': 2, 'dragon': 2, 'fire': 0.5, 'water': 0.5, 'ice': 0.5, 'steel': 0.5 },
        'fighting': { 'normal': 2, 'ice': 2, 'rock': 2, 'dark': 2, 'steel': 2, 'poison': 0.5, 'flying': 0.5, 'psychic': 0.5, 'bug': 0.5, 'ghost': 0 },
        'poison': { 'grass': 2, 'fairy': 2, 'poison': 0.5, 'ground': 0.5, 'rock': 0.5, 'ghost': 0.5, 'steel': 0 },
        'ground': { 'fire': 2, 'electric': 2, 'poison': 2, 'rock': 2, 'steel': 2, 'grass': 0.5, 'bug': 0.5, 'flying': 0 },
        'flying': { 'grass': 2, 'fighting': 2, 'bug': 2, 'electric': 0.5, 'rock': 0.5, 'steel': 0.5 },
        'psychic': { 'fighting': 2, 'poison': 2, 'psychic': 0.5, 'steel': 0.5, 'dark': 0 },
        'bug': { 'grass': 2, 'psychic': 2, 'dark': 2, 'fire': 0.5, 'fighting': 0.5, 'poison': 0.5, 'flying': 0.5, 'ghost': 0.5, 'steel': 0.5, 'fairy': 0.5 },
        'rock': { 'fire': 2, 'ice': 2, 'flying': 2, 'bug': 2, 'fighting': 0.5, 'ground': 0.5, 'steel': 0.5 },
        'ghost': { 'psychic': 2, 'ghost': 2, 'dark': 0.5, 'normal': 0 },
        'dragon': { 'dragon': 2, 'steel': 0.5, 'fairy': 0 },
        'steel': { 'ice': 2, 'rock': 2, 'fairy': 2, 'fire': 0.5, 'water': 0.5, 'electric': 0.5, 'steel': 0.5 },
        'dark': { 'psychic': 2, 'ghost': 2, 'fighting': 0.5, 'dark': 0.5, 'fairy': 0.5 },
        'fairy': { 'fighting': 2, 'dragon': 2, 'dark': 2, 'fire': 0.5, 'poison': 0.5, 'steel': 0.5 }
    };

    // -- DOM Elements --
    const selectionScreen = document.getElementById('selection-screen');
    const battleScreen = document.getElementById('battle-screen');
    const pokemonGrid = document.getElementById('pokemon-grid');
    const playerFighterEl = document.getElementById('player-fighter');
    const cpuFighterEl = document.getElementById('cpu-fighter');
    const resultDisplay = document.getElementById('result-display');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');
    const instructionText = document.getElementById('instruction-text');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const player1NameGroup = document.getElementById('player1-name-group');
    const player2NameGroup = document.getElementById('player2-name-group');
    const player1Label = document.getElementById('player1-label');
    const player2Label = document.getElementById('player2-label');
    const pokemonSearchInput = document.getElementById('pokemon-search');
    const searchSuggestions = document.getElementById('search-suggestions');

    // -- Game State --
    let player1Pokemon = null;
    let player1Name = '';
    let player2Name = '';
    let selectedPokemon = null;

    // -- Init --
    initGame();

    function initGame() {
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        renderPokemonGrid();
        restartBtn.addEventListener('click', resetGame);
        pokemonSearchInput.addEventListener('input', handleSearchInput);
        pokemonSearchInput.addEventListener('blur', () => {
            // Delay to allow click on suggestion
            setTimeout(() => hideSuggestions(), 200);
        });
        updateInstruction();
    }

    function handleSearchInput(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length === 0) {
            hideSuggestions();
            return;
        }

        const matches = pokemonData.filter(pokemon =>
            pokemon.name.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            showSuggestions(matches);
        } else {
            hideSuggestions();
        }
    }

    function showSuggestions(matches) {
        searchSuggestions.innerHTML = '';
        matches.forEach(pokemon => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            const typeBadges = pokemon.types.map(type =>
                `<span class="type-badge bg-${type}">${translateType(type)}</span>`
            ).join('');
            item.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <span class="pokemon-name">${pokemon.name}</span>
                <div class="suggestion-types">${typeBadges}</div>
            `;
            item.addEventListener('click', () => {
                selectFromSearch(pokemon);
            });
            searchSuggestions.appendChild(item);
        });
        searchSuggestions.classList.remove('hidden');
    }

    function hideSuggestions() {
        searchSuggestions.classList.add('hidden');
    }

    function selectFromSearch(pokemon) {
        pokemonSearchInput.value = '';
        hideSuggestions();
        handlePokemonSelect(pokemon, null);
    }

    function updateInstruction() {
        instructionText.textContent = 'ポケモンを えらぼう！';
    }

    function getRandomPokemon() {
        const randomIndex = Math.floor(Math.random() * pokemonData.length);
        return pokemonData[randomIndex];
    }

    function handleRandomSelect() {
        if (selectedPokemon !== null) {
            // Already have a selection - confirm it
            const cards = pokemonGrid.querySelectorAll('.pokemon-card');
            let targetCard = null;
            cards.forEach(card => {
                if (card.dataset.pokemonId == selectedPokemon.id) {
                    targetCard = card;
                }
            });
            handlePokemonSelect(selectedPokemon, targetCard);
        } else {
            // No selection - pick a random pokemon
            const randomPokemon = getRandomPokemon();
            const cards = pokemonGrid.querySelectorAll('.pokemon-card');
            let targetCard = null;
            cards.forEach(card => {
                if (card.dataset.pokemonId == randomPokemon.id) {
                    targetCard = card;
                }
            });
            handlePokemonSelect(randomPokemon, targetCard);
        }
    }

    function renderPokemonGrid() {
        pokemonGrid.innerHTML = '';

        // Add random card first
        const randomCard = document.createElement('div');
        randomCard.className = 'pokemon-card random-card';
        randomCard.innerHTML = `
            <div class="random-icon">🎲</div>
            <h3>おまかせ</h3>
        `;
        randomCard.addEventListener('click', handleRandomSelect);
        pokemonGrid.appendChild(randomCard);

        // Add pokemon cards
        pokemonData.forEach(pokemon => {
            const card = document.createElement('div');
            card.className = 'pokemon-card';
            card.dataset.pokemonId = pokemon.id;
            const typeBadges = pokemon.types.map(type =>
                `<span class="type-badge bg-${type}">${translateType(type)}</span>`
            ).join('');
            card.innerHTML = `
                <span class="pokemon-number">No.${String(pokemon.id).padStart(3, '0')}</span>
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <div class="type-badges">${typeBadges}</div>
            `;
            card.addEventListener('click', () => handlePokemonSelect(pokemon, card));
            pokemonGrid.appendChild(card);
        });
    }

    function clearSelection() {
        const cards = pokemonGrid.querySelectorAll('.pokemon-card');
        cards.forEach(card => card.classList.remove('selected'));
    }

    function handlePokemonSelect(pokemon, cardElement) {
        if (player1Pokemon === null) {
            // Player 1's turn
            if (selectedPokemon === null || selectedPokemon.id !== pokemon.id) {
                // First click - select this pokemon
                clearSelection();
                selectedPokemon = pokemon;
                if (cardElement) {
                    cardElement.classList.add('selected');
                }
                instructionText.textContent = 'もういちど クリックで けってい！';
            } else {
                // Second click - confirm selection
                player1Name = player1NameInput.value.trim() || 'Player 1';
                player1Pokemon = pokemon;
                selectedPokemon = null;
                clearSelection();

                // Switch to Player 2's name input
                player1NameGroup.classList.add('hidden');
                player2NameGroup.classList.remove('hidden');

                updateInstruction();
            }
        } else {
            // Player 2's turn
            if (selectedPokemon === null || selectedPokemon.id !== pokemon.id) {
                // First click - select this pokemon
                clearSelection();
                selectedPokemon = pokemon;
                if (cardElement) {
                    cardElement.classList.add('selected');
                }
                instructionText.textContent = 'もういちど クリックで けってい！';
            } else {
                // Second click - confirm and start battle
                player2Name = player2NameInput.value.trim() || 'Player 2';
                startGame(player1Pokemon, pokemon);
            }
        }
    }

    function translateType(type) {
        const dict = {
            'fire': 'ほのお',
            'water': 'みず',
            'grass': 'くさ',
            'electric': 'でんき',
            'psychic': 'エスパー',
            'ice': 'こおり',
            'fighting': 'かくとう',
            'ground': 'じめん',
            'flying': 'ひこう',
            'rock': 'いわ',
            'poison': 'どく',
            'bug': 'むし',
            'ghost': 'ゴースト',
            'steel': 'はがね',
            'dragon': 'ドラゴン',
            'dark': 'あく',
            'fairy': 'フェアリー',
            'normal': 'ノーマル'
        };
        return dict[type] || type;
    }

    function startGame(player1, player2) {
        // Update labels with player names
        player1Label.textContent = player1Name;
        player2Label.textContent = player2Name;

        // Set pokemon names
        document.getElementById('player1-pokemon-name').textContent = player1.name;
        document.getElementById('player2-pokemon-name').textContent = player2.name;

        // Transition to battle screen
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');
        battleScreen.classList.remove('hidden');
        battleScreen.classList.add('active');

        // Show both players
        updateFighterCard(playerFighterEl, player1);
        updateFighterCard(cpuFighterEl, player2);

        // Resolve battle after a short delay
        setTimeout(() => {
            resolveBattle(player1, player2);
        }, 500);
    }

    function updateFighterCard(element, pokemon) {
        element.innerHTML = `<img src="${pokemon.image}" alt="${pokemon.name}">`;
        element.style.borderColor = `var(--type-${pokemon.types[0]})`;
    }

    function resolveBattle(p1, p2) {
        const { result, p1Multiplier, p2Multiplier } = calculateEffectiveness(p1.types, p2.types);

        let message = '';
        if (result === 'win') {
            message = `${player1Name} のかち！`;
            resultMessage.style.color = '#F44336';
        } else if (result === 'lose') {
            message = `${player2Name} のかち！`;
            resultMessage.style.color = '#2196F3';
        } else {
            message = 'ひきわけ';
            resultMessage.style.color = '#9E9E9E';
        }

        resultMessage.textContent = message;

        // Show types and multipliers under each pokemon
        const p1TypesStr = p1.types.map(t => translateType(t)).join('/');
        const p2TypesStr = p2.types.map(t => translateType(t)).join('/');

        document.getElementById('player1-types').textContent = p1TypesStr;
        document.getElementById('player1-multiplier').textContent = `×${p1Multiplier}`;
        document.getElementById('player2-types').textContent = p2TypesStr;
        document.getElementById('player2-multiplier').textContent = `×${p2Multiplier}`;

        resultDisplay.classList.remove('hidden');
    }

    function calculateEffectiveness(attackerTypes, defenderTypes) {
        // Calculate total multiplier for attacker vs defender
        let attackerMultiplier = 1;
        for (const atkType of attackerTypes) {
            const relationships = typeChart[atkType];
            if (relationships) {
                for (const defType of defenderTypes) {
                    if (relationships[defType] !== undefined) {
                        attackerMultiplier *= relationships[defType];
                    }
                }
            }
        }

        // Calculate total multiplier for defender vs attacker
        let defenderMultiplier = 1;
        for (const defType of defenderTypes) {
            const relationships = typeChart[defType];
            if (relationships) {
                for (const atkType of attackerTypes) {
                    if (relationships[atkType] !== undefined) {
                        defenderMultiplier *= relationships[atkType];
                    }
                }
            }
        }

        // Compare multipliers
        let result;
        if (attackerMultiplier > defenderMultiplier) {
            result = 'win';
        } else if (attackerMultiplier < defenderMultiplier) {
            result = 'lose';
        } else {
            result = 'draw';
        }

        return {
            result,
            p1Multiplier: attackerMultiplier,
            p2Multiplier: defenderMultiplier
        };
    }

    function resetGame() {
        battleScreen.classList.remove('active');
        battleScreen.classList.add('hidden');

        selectionScreen.classList.remove('hidden');
        selectionScreen.classList.add('active');

        resultDisplay.classList.add('hidden');
        playerFighterEl.innerHTML = '';
        cpuFighterEl.innerHTML = '';
        playerFighterEl.style.borderColor = '#ddd';
        cpuFighterEl.style.borderColor = '#ddd';

        // Reset name inputs
        player1NameGroup.classList.remove('hidden');
        player2NameGroup.classList.add('hidden');
        player1NameInput.value = '';
        player2NameInput.value = '';
        pokemonSearchInput.value = '';
        hideSuggestions();

        // Reset game state
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        selectedPokemon = null;
        updateInstruction();
    }
});
