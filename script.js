document.addEventListener('DOMContentLoaded', () => {
    console.log('Pokemon Janken App Loaded');

    // -- Data --
    const pokemonData = [
        { id: 1, name: 'フシギダネ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 2, name: 'フシギソウ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
        { id: 3, name: 'フシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
        { id: 10003, name: 'メガフシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png' },
        { id: 4, name: 'ヒトカゲ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 5, name: 'リザード', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
        { id: 6, name: 'リザードン', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 6, name: 'メガリザードンX', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png' },
        { id: 10007, name: 'メガリザードンY', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png' },
        { id: 7, name: 'ゼニガメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
        { id: 8, name: 'カメール', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
        { id: 9, name: 'カメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
        { id: 10009, name: 'メガカメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png' },
        { id: 10, name: 'キャタピー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
        { id: 11, name: 'トランセル', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png' },
        { id: 12, name: 'バタフリー', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
        { id: 13, name: 'ビードル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png' },
        { id: 14, name: 'コクーン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png' },
        { id: 15, name: 'スピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' },
        { id: 10015, name: 'メガスピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10090.png' },
        { id: 16, name: 'ポッポ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
        { id: 17, name: 'ピジョン', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png' },
        { id: 18, name: 'ピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png' },
        { id: 10018, name: 'メガピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10073.png' },
        { id: 19, name: 'コラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png' },
        { id: 10091, name: 'コラッタ(アローラ)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10091.png' },
        { id: 20, name: 'ラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png' },
        { id: 10092, name: 'ラッタ(アローラ)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10092.png' },
        { id: 21, name: 'オニスズメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png' },
        { id: 22, name: 'オニドリル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/22.png' },
        { id: 23, name: 'アーボ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png' },
        { id: 24, name: 'アーボック', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png' },
        { id: 25, name: 'ピカチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 26, name: 'ライチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
        { id: 10100, name: 'ライチュウ(アローラ)', types: ['electric', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10100.png' },
        { id: 10026, name: 'メガライチュウX', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
        { id: 10027, name: 'メガライチュウY', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
        { id: 27, name: 'サンド', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
        { id: 10101, name: 'サンド(アローラのすがた)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10101.png' },
        { id: 28, name: 'サンドパン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png' },
        { id: 10102, name: 'サンドパン(アローラ)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10102.png' },
        { id: 29, name: 'ニドラン♀', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/29.png' },
        { id: 30, name: 'ニドリーナ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/30.png' },
        { id: 31, name: 'ニドクイン', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png' },
        { id: 32, name: 'ニドラン♂', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/32.png' },
        { id: 33, name: 'ニドリーノ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/33.png' },
        { id: 34, name: 'ニドキング', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png' },
        { id: 35, name: 'ピッピ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png' },
        { id: 36, name: 'ピクシー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png' },
        { id: 10036, name: 'メガピクシー', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png' },
        { id: 37, name: 'ロコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png' },
        { id: 10103, name: 'ロコン(アローラ)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10103.png' },
        { id: 38, name: 'キュウコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png' },
        { id: 10104, name: 'キュウコン(アローラ)', types: ['ice', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10104.png' },
        { id: 39, name: 'プリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png' },
        { id: 40, name: 'プクリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/40.png' },
        { id: 41, name: 'ズバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png' },
        { id: 42, name: 'ゴルバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/42.png' },
        { id: 43, name: 'ナゾノクサ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/43.png' },
        { id: 44, name: 'クサイハナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/44.png' },
        { id: 45, name: 'ラフレシア', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/45.png' },
        { id: 46, name: 'パラス', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/46.png' },
        { id: 47, name: 'パラセクト', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/47.png' },
        { id: 48, name: 'コンパン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/48.png' },
        { id: 49, name: 'モルフォン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/49.png' },
        { id: 50, name: 'ディグダ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/50.png' },
        { id: 10105, name: 'ディグダ(アローラ)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10105.png' },
        { id: 51, name: 'ダグトリオ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png' },
        { id: 10106, name: 'ダグトリオ(アローラ)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10106.png' },
        { id: 52, name: 'ニャース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png' },
        { id: 10107, name: 'ニャース(アローラ)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10107.png' },
        { id: 10161, name: 'ニャース(ガラル)', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10161.png' },
        { id: 53, name: 'ペルシアン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png' },
        { id: 10108, name: 'ペルシアン(アローラ)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10108.png' },
        { id: 54, name: 'コダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
        { id: 55, name: 'ゴルダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png' },
        { id: 56, name: 'マンキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png' },
        { id: 57, name: 'オコリザル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png' },
        { id: 58, name: 'ガーディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png' },
        { id: 10229, name: 'ガーディ(ヒスイ)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10229.png' },
        { id: 59, name: 'ウインディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
        { id: 10230, name: 'ウインディ(ヒスイ)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10230.png' },
        { id: 60, name: 'ニョロモ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png' },
        { id: 61, name: 'ニョロゾ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/61.png' },
        { id: 62, name: 'ニョロボン', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png' },
        { id: 63, name: 'ケーシィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
        { id: 64, name: 'ユンゲラー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png' },
        { id: 65, name: 'フーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' },
        { id: 10065, name: 'メガフーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png' },
        { id: 66, name: 'ワンリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
        { id: 67, name: 'ゴーリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png' },
        { id: 68, name: 'カイリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png' },
        { id: 69, name: 'マダツボミ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png' },
        { id: 70, name: 'ウツドン', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png' },
        { id: 71, name: 'ウツボット', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png' },
        { id: 10071, name: 'メガウツボット', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png' },
        { id: 72, name: 'メノクラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/72.png' },
        { id: 73, name: 'ドククラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png' },
        { id: 74, name: 'イシツブテ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
        { id: 10109, name: 'イシツブテ(アローラ)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10109.png' },
        { id: 75, name: 'ゴローン', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png' },
        { id: 10110, name: 'ゴローン(アローラ)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10110.png' },
        { id: 76, name: 'ゴローニャ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png' },
        { id: 10111, name: 'ゴローニャ(アローラ)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10111.png' },
        { id: 77, name: 'ポニータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png' },
        { id: 10162, name: 'ポニータ(ガラル)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10162.png' },
        { id: 78, name: 'ギャロップ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png' },
        { id: 10163, name: 'ギャロップ(ガラル)', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10163.png' },
        { id: 79, name: 'ヤドン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png' },
        { id: 10164, name: 'ヤドン(ガラル)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10164.png' },
        { id: 80, name: 'ヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png' },
        { id: 10080, name: 'メガヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10071.png' },
        { id: 10165, name: 'ヤドラン(ガラル)', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10165.png' },
        { id: 81, name: 'コイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png' },
        { id: 82, name: 'レアコイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png' },
        { id: 83, name: 'カモネギ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png' },
        { id: 10166, name: 'カモネギ(ガラル)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10166.png' },
        { id: 84, name: 'ドードー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/84.png' },
        { id: 85, name: 'ドードリオ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/85.png' },
        { id: 86, name: 'パウワウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/86.png' },
        { id: 87, name: 'ジュゴン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png' },
        { id: 88, name: 'ベトベター', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png' },
        { id: 10112, name: 'ベトベター(アローラ)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10112.png' },
        { id: 89, name: 'ベトベトン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png' },
        { id: 10113, name: 'ベトベトン(アローラ)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10113.png' },
        { id: 90, name: 'シェルダー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png' },
        { id: 91, name: 'パルシェン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png' },
        { id: 92, name: 'ゴース', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
        { id: 93, name: 'ゴースト', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
        { id: 94, name: 'ゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
        { id: 10094, name: 'メガゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png' },
        { id: 95, name: 'イワーク', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png' },
        { id: 96, name: 'スリープ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png' },
        { id: 97, name: 'スリーパー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png' },
        { id: 98, name: 'クラブ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/98.png' },
        { id: 99, name: 'キングラー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png' },
        { id: 100, name: 'ビリリダマ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png' },
        { id: 10231, name: 'ビリリダマ(ヒスイ)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10231.png' },
        { id: 101, name: 'マルマイン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png' },
        { id: 10232, name: 'マルマイン(ヒスイ)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10232.png' },
        { id: 102, name: 'タマタマ', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png' },
        { id: 103, name: 'ナッシー', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png' },
        { id: 10114, name: 'ナッシー(アローラ)', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10114.png' },
        { id: 104, name: 'カラカラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png' },
        { id: 105, name: 'ガラガラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png' },
        { id: 10115, name: 'ガラガラ(アローラ)', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10115.png' },
        { id: 106, name: 'サワムラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png' },
        { id: 107, name: 'エビワラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png' },
        { id: 108, name: 'ベロリンガ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/108.png' },
        { id: 109, name: 'ドガース', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png' },
        { id: 110, name: 'マタドガス', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png' },
        { id: 10167, name: 'マタドガス(ガラル)', types: ['poison', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10167.png' },
        { id: 111, name: 'サイホーン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/111.png' },
        { id: 112, name: 'サイドン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png' },
        { id: 113, name: 'ラッキー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png' },
        { id: 114, name: 'モンジャラ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png' },
        { id: 115, name: 'ガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png' },
        { id: 10115, name: 'メガガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png' },
        { id: 116, name: 'タッツー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png' },
        { id: 117, name: 'シードラ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/117.png' },
        { id: 118, name: 'トサキント', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/118.png' },
        { id: 119, name: 'アズマオウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/119.png' },
        { id: 120, name: 'ヒトデマン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png' },
        { id: 121, name: 'スターミー', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
        { id: 10121, name: 'メガスターミー', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
        { id: 122, name: 'バリヤード', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png' },
        { id: 10168, name: 'バリヤード(ガラル)', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10168.png' },
        { id: 123, name: 'ストライク', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png' },
        { id: 124, name: 'ルージュラ', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png' },
        { id: 125, name: 'エレブー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png' },
        { id: 126, name: 'ブーバー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png' },
        { id: 127, name: 'カイロス', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png' },
        { id: 10127, name: 'メガカイロス', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10040.png' },
        { id: 128, name: 'ケンタロス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png' },
        { id: 10250, name: 'ケンタロス(パルデア)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10250.png' },
        { id: 10251, name: 'ケンタロス(パルデア炎)', types: ['fighting', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10251.png' },
        { id: 10252, name: 'ケンタロス(パルデア水)', types: ['fighting', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10252.png' },
        { id: 129, name: 'コイキング', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png' },
        { id: 130, name: 'ギャラドス', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' },
        { id: 10130, name: 'メガギャラドス', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png' },
        { id: 131, name: 'ラプラス', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/131.png' },
        { id: 132, name: 'メタモン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png' },
        { id: 133, name: 'イーブイ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png' },
        { id: 134, name: 'シャワーズ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/134.png' },
        { id: 135, name: 'サンダース', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/135.png' },
        { id: 136, name: 'ブースター', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/136.png' },
        { id: 137, name: 'ポリゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/137.png' },
        { id: 138, name: 'オムナイト', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/138.png' },
        { id: 139, name: 'オムスター', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/139.png' },
        { id: 140, name: 'カブト', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/140.png' },
        { id: 141, name: 'カブトプス', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/141.png' },
        { id: 142, name: 'プテラ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/142.png' },
        { id: 10142, name: 'メガプテラ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10042.png' },
        { id: 143, name: 'カビゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
        { id: 144, name: 'フリーザー', types: ['ice', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png' },
        { id: 10169, name: 'フリーザー(ガラル)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10169.png' },
        { id: 145, name: 'サンダー', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png' },
        { id: 10170, name: 'サンダー(ガラル)', types: ['fighting', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10170.png' },
        { id: 146, name: 'ファイヤー', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png' },
        { id: 10171, name: 'ファイヤー(ガラル)', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10171.png' },
        { id: 147, name: 'ミニリュウ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
        { id: 148, name: 'ハクリュー', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png' },
        { id: 149, name: 'カイリュー', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 10149, name: 'メガカイリュー', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 150, name: 'ミュウツー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
        { id: 10150, name: 'メガミュウツーX', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png' },
        { id: 10151, name: 'メガミュウツーY', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png' },
        { id: 151, name: 'ミュウ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
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
