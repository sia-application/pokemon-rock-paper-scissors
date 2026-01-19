document.addEventListener('DOMContentLoaded', () => {
    console.log('Pokemon Janken App Loaded');

    // -- Data --
    const pokemonData = [
        { id: 1, name: 'フシギダネ', type: 'grass', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 4, name: 'ヒトカゲ', type: 'fire', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 7, name: 'ゼニガメ', type: 'water', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
        { id: 25, name: 'ピカチュウ', type: 'electric', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 66, name: 'ワンリキー', type: 'fighting', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
        { id: 74, name: 'イシツブテ', type: 'rock', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
        { id: 63, name: 'ケーシィ', type: 'psychic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
        { id: 16, name: 'ポッポ', type: 'flying', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
        { id: 27, name: 'サンド', type: 'ground', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
        { id: 124, name: 'ルージュラ', type: 'ice', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png' },
        { id: 92, name: 'ゴース', type: 'ghost', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
        { id: 147, name: 'ミニリュウ', type: 'dragon', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
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
        updateInstruction();
    }

    function updateInstruction() {
        instructionText.textContent = 'ポケモンを えらぼう！';
    }

    function getRandomPokemon() {
        const randomIndex = Math.floor(Math.random() * pokemonData.length);
        return pokemonData[randomIndex];
    }

    function handleRandomSelect() {
        const randomPokemon = getRandomPokemon();
        handlePokemonSelect(randomPokemon, null);
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
            card.innerHTML = `
                <img src="${pokemon.image}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <span class="type-badge bg-${pokemon.type}">${translateType(pokemon.type)}</span>
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
        element.style.borderColor = `var(--type-${pokemon.type})`;
    }

    function resolveBattle(p1, p2) {
        const result = calculateEffectiveness(p1.type, p2.type);

        let message = '';
        if (result === 'win') {
            message = 'かち！';
            resultMessage.style.color = '#F44336';
        } else if (result === 'lose') {
            message = 'まけ...';
            resultMessage.style.color = '#2196F3';
        } else {
            message = 'ひきわけ';
            resultMessage.style.color = '#9E9E9E';
        }

        resultMessage.textContent = message;
        resultDisplay.classList.remove('hidden');
    }

    function calculateEffectiveness(attackerType, defenderType) {
        if (attackerType === defenderType) return 'draw';

        const relationships = typeChart[attackerType];
        if (!relationships) return 'draw'; // Unknown relationship

        const multiplier = relationships[defenderType];

        if (multiplier === 2) return 'win';
        if (multiplier === 0.5 || multiplier === 0) return 'lose';

        // If not explicitly defined, check reverse or default to draw/neutral
        // For simple janken, if A beats B, then B should lose to A.
        // But in Pokemon, it's not always symmetric (e.g. Bug vs Psychic).
        // Let's check if the opponent has a 2x against us.

        const defenseRelationships = typeChart[defenderType];
        if (defenseRelationships && defenseRelationships[attackerType] === 2) {
            return 'lose';
        }

        return 'draw';
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

        // Reset game state
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        selectedPokemon = null;
        updateInstruction();
    }
});
