document.addEventListener('DOMContentLoaded', () => {
    console.log('Pokemon Janken App Loaded');

    // -- Data --
    const pokemonData = [
        // Generation 1
        { id: 1, name: 'フシギダネ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' },
        { id: 2, name: 'フシギソウ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png' },
        { id: 3, name: 'フシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png' },
        { id: 3, name: 'メガフシギバナ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10033.png' },
        { id: 4, name: 'ヒトカゲ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' },
        { id: 5, name: 'リザード', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/5.png' },
        { id: 6, name: 'リザードン', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png' },
        { id: 6, name: 'メガリザードンX', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10034.png' },
        { id: 6, name: 'メガリザードンY', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10035.png' },
        { id: 7, name: 'ゼニガメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png' },
        { id: 8, name: 'カメール', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/8.png' },
        { id: 9, name: 'カメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png' },
        { id: 9, name: 'メガカメックス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10036.png' },
        { id: 10, name: 'キャタピー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10.png' },
        { id: 11, name: 'トランセル', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/11.png' },
        { id: 12, name: 'バタフリー', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png' },
        { id: 13, name: 'ビードル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/13.png' },
        { id: 14, name: 'コクーン', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/14.png' },
        { id: 15, name: 'スピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/15.png' },
        { id: 15, name: 'メガスピアー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10090.png' },
        { id: 16, name: 'ポッポ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/16.png' },
        { id: 17, name: 'ピジョン', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/17.png' },
        { id: 18, name: 'ピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png' },
        { id: 18, name: 'メガピジョット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10073.png' },
        { id: 19, name: 'コラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png' },
        { id: 29, name: 'コラッタ(アローラのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10091.png' },
        { id: 20, name: 'ラッタ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png' },
        { id: 20, name: 'ラッタ(アローラのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10092.png' },
        { id: 21, name: 'オニスズメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/21.png' },
        { id: 22, name: 'オニドリル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/22.png' },
        { id: 23, name: 'アーボ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/23.png' },
        { id: 24, name: 'アーボック', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/24.png' },
        { id: 25, name: 'ピカチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
        { id: 26, name: 'ライチュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png' },
        { id: 26, name: 'ライチュウ(アローラのすがた)', types: ['electric', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10100.png' },
        { id: 26, name: 'メガライチュウX', types: ['electric'], image: 'images/mega_raichu_x.png' },
        { id: 26, name: 'メガライチュウY', types: ['electric'], image: 'images/mega_raichu_y.png' },
        { id: 27, name: 'サンド', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/27.png' },
        { id: 27, name: 'サンド(アローラのすがた)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10101.png' },
        { id: 28, name: 'サンドパン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/28.png' },
        { id: 28, name: 'サンドパン(アローラのすがた)', types: ['ice', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10102.png' },
        { id: 29, name: 'ニドラン♀', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/29.png' },
        { id: 30, name: 'ニドリーナ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/30.png' },
        { id: 31, name: 'ニドクイン', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/31.png' },
        { id: 32, name: 'ニドラン♂', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/32.png' },
        { id: 33, name: 'ニドリーノ', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/33.png' },
        { id: 34, name: 'ニドキング', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/34.png' },
        { id: 35, name: 'ピッピ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/35.png' },
        { id: 36, name: 'ピクシー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/36.png' },
        { id: 36, name: 'メガピクシー', types: ['fairy', 'flying'], image: 'images/mega_clefable.png' },
        { id: 37, name: 'ロコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/37.png' },
        { id: 37, name: 'ロコン(アローラのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10103.png' },
        { id: 38, name: 'キュウコン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/38.png' },
        { id: 38, name: 'キュウコン(アローラのすがた)', types: ['ice', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10104.png' },
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
        { id: 50, name: 'ディグダ(アローラのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10105.png' },
        { id: 51, name: 'ダグトリオ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/51.png' },
        { id: 51, name: 'ダグトリオ(アローラのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10106.png' },
        { id: 52, name: 'ニャース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png' },
        { id: 52, name: 'ニャース(アローラのすがた)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10107.png' },
        { id: 52, name: 'ニャース(ガラル)', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10161.png' },
        { id: 53, name: 'ペルシアン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/53.png' },
        { id: 53, name: 'ペルシアン(アローラのすがた)', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10108.png' },
        { id: 54, name: 'コダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png' },
        { id: 55, name: 'ゴルダック', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/55.png' },
        { id: 56, name: 'マンキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/56.png' },
        { id: 57, name: 'オコリザル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/57.png' },
        { id: 58, name: 'ガーディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png' },
        { id: 58, name: 'ガーディ(ヒスイのすがた)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10229.png' },
        { id: 59, name: 'ウインディ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/59.png' },
        { id: 59, name: 'ウインディ(ヒスイのすがた)', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10230.png' },
        { id: 60, name: 'ニョロモ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/60.png' },
        { id: 61, name: 'ニョロゾ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/61.png' },
        { id: 62, name: 'ニョロボン', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/62.png' },
        { id: 63, name: 'ケーシィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png' },
        { id: 64, name: 'ユンゲラー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/64.png' },
        { id: 65, name: 'フーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/65.png' },
        { id: 65, name: 'メガフーディン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10037.png' },
        { id: 66, name: 'ワンリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png' },
        { id: 67, name: 'ゴーリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/67.png' },
        { id: 68, name: 'カイリキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/68.png' },
        { id: 69, name: 'マダツボミ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/69.png' },
        { id: 70, name: 'ウツドン', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/70.png' },
        { id: 71, name: 'ウツボット', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/71.png' },
        { id: 71, name: 'メガウツボット', types: ['grass', 'poison'], image: 'images/mega_victreebel.png' },
        { id: 72, name: 'メノクラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/72.png' },
        { id: 73, name: 'ドククラゲ', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/73.png' },
        { id: 74, name: 'イシツブテ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/74.png' },
        { id: 74, name: 'イシツブテ(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10109.png' },
        { id: 75, name: 'ゴローン', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/75.png' },
        { id: 75, name: 'ゴローン(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10110.png' },
        { id: 76, name: 'ゴローニャ', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/76.png' },
        { id: 76, name: 'ゴローニャ(アローラのすがた)', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10111.png' },
        { id: 77, name: 'ポニータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/77.png' },
        { id: 77, name: 'ポニータ(ガラルのすがた)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10162.png' },
        { id: 78, name: 'ギャロップ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/78.png' },
        { id: 78, name: 'ギャロップ(ガラルのすがた)', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10163.png' },
        { id: 79, name: 'ヤドン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/79.png' },
        { id: 79, name: 'ヤドン(ガラルのすがた)', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10164.png' },
        { id: 80, name: 'ヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/80.png' },
        { id: 80, name: 'メガヤドラン', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10071.png' },
        { id: 80, name: 'ヤドラン(ガラルのすがた)', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10165.png' },
        { id: 81, name: 'コイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/81.png' },
        { id: 82, name: 'レアコイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/82.png' },
        { id: 83, name: 'カモネギ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/83.png' },
        { id: 83, name: 'カモネギ(ガラルのすがた)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10166.png' },
        { id: 84, name: 'ドードー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/84.png' },
        { id: 85, name: 'ドードリオ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/85.png' },
        { id: 86, name: 'パウワウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/86.png' },
        { id: 87, name: 'ジュゴン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/87.png' },
        { id: 88, name: 'ベトベター', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/88.png' },
        { id: 88, name: 'ベトベター(アローラのすがた)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10112.png' },
        { id: 89, name: 'ベトベトン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/89.png' },
        { id: 89, name: 'ベトベトン(アローラのすがた)', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10113.png' },
        { id: 90, name: 'シェルダー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/90.png' },
        { id: 91, name: 'パルシェン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/91.png' },
        { id: 92, name: 'ゴース', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png' },
        { id: 93, name: 'ゴースト', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png' },
        { id: 94, name: 'ゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png' },
        { id: 94, name: 'メガゲンガー', types: ['ghost', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10038.png' },
        { id: 95, name: 'イワーク', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/95.png' },
        { id: 96, name: 'スリープ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/96.png' },
        { id: 97, name: 'スリーパー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/97.png' },
        { id: 98, name: 'クラブ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/98.png' },
        { id: 99, name: 'キングラー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/99.png' },
        { id: 100, name: 'ビリリダマ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/100.png' },
        { id: 100, name: 'ビリリダマ(ヒスイのすがた)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10231.png' },
        { id: 101, name: 'マルマイン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/101.png' },
        { id: 102, name: 'マルマイン(ヒスイのすがた)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10232.png' },
        { id: 102, name: 'タマタマ', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/102.png' },
        { id: 103, name: 'ナッシー', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/103.png' },
        { id: 103, name: 'ナッシー(アローラのすがた)', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10114.png' },
        { id: 104, name: 'カラカラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/104.png' },
        { id: 105, name: 'ガラガラ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/105.png' },
        { id: 105, name: 'ガラガラ(アローラのすがた)', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10115.png' },
        { id: 106, name: 'サワムラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/106.png' },
        { id: 107, name: 'エビワラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/107.png' },
        { id: 108, name: 'ベロリンガ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/108.png' },
        { id: 109, name: 'ドガース', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/109.png' },
        { id: 110, name: 'マタドガス', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/110.png' },
        { id: 110, name: 'マタドガス(ガラルのすがた)', types: ['poison', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10167.png' },
        { id: 111, name: 'サイホーン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/111.png' },
        { id: 112, name: 'サイドン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/112.png' },
        { id: 113, name: 'ラッキー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/113.png' },
        { id: 114, name: 'モンジャラ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/114.png' },
        { id: 115, name: 'ガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/115.png' },
        { id: 115, name: 'メガガルーラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10039.png' },
        { id: 116, name: 'タッツー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/116.png' },
        { id: 117, name: 'シードラ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/117.png' },
        { id: 118, name: 'トサキント', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/118.png' },
        { id: 119, name: 'アズマオウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/119.png' },
        { id: 120, name: 'ヒトデマン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/120.png' },
        { id: 121, name: 'スターミー', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/121.png' },
        { id: 121, name: 'メガスターミー', types: ['water', 'psychic'], image: 'images/mega_starmie.png' },
        { id: 122, name: 'バリヤード', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/122.png' },
        { id: 122, name: 'バリヤード(ガラルのすがた)', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10168.png' },
        { id: 123, name: 'ストライク', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/123.png' },
        { id: 124, name: 'ルージュラ', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/124.png' },
        { id: 125, name: 'エレブー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/125.png' },
        { id: 126, name: 'ブーバー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/126.png' },
        { id: 127, name: 'カイロス', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/127.png' },
        { id: 127, name: 'メガカイロス', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10040.png' },
        { id: 128, name: 'ケンタロス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/128.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・コンバットしゅ)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10250.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・ブレイズしゅ)', types: ['fighting', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10251.png' },
        { id: 128, name: 'ケンタロス(パルデアのすがた・ウォーターしゅ)', types: ['fighting', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10252.png' },
        { id: 129, name: 'コイキング', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/129.png' },
        { id: 130, name: 'ギャラドス', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/130.png' },
        { id: 130, name: 'メガギャラドス', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10041.png' },
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
        { id: 142, name: 'メガプテラ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10042.png' },
        { id: 143, name: 'カビゴン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png' },
        { id: 144, name: 'フリーザー', types: ['ice', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png' },
        { id: 144, name: 'フリーザー(ガラルのすがた)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10169.png' },
        { id: 145, name: 'サンダー', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png' },
        { id: 145, name: 'サンダー(ガラルのすがた)', types: ['fighting', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10170.png' },
        { id: 146, name: 'ファイヤー', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png' },
        { id: 146, name: 'ファイヤー(ガラルのすがた)', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10171.png' },
        { id: 147, name: 'ミニリュウ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/147.png' },
        { id: 148, name: 'ハクリュー', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/148.png' },
        { id: 149, name: 'カイリュー', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png' },
        { id: 149, name: 'メガカイリュー', types: ['dragon', 'flying'], image: 'images/mega_dragonite.png' },
        { id: 150, name: 'ミュウツー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png' },
        { id: 150, name: 'メガミュウツーX', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10043.png' },
        { id: 151, name: 'メガミュウツーY', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10044.png' },
        { id: 151, name: 'ミュウ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png' },
        // Generation 2
        { id: 152, name: 'チコリータ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png' },
        { id: 153, name: 'ベイリーフ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/153.png' },
        { id: 154, name: 'メガニウム', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/154.png' },
        { id: 154, name: 'メガメガニウム', types: ['grass', 'fairy'], image: 'images/mega_meganium.png' },
        { id: 155, name: 'ヒノアラシ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png' },
        { id: 156, name: 'マグマラシ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/156.png' },
        { id: 157, name: 'バクフーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/157.png' },
        { id: 157, name: 'バクフーン(ヒスイのすがた)', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10233.png' },
        { id: 158, name: 'ワニノコ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png' },
        { id: 159, name: 'アリゲイツ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/159.png' },
        { id: 160, name: 'オーダイル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/160.png' },
        { id: 160, name: 'メガオーダイル', types: ['water', 'dragon'], image: 'images/mega_feraligatr.png' },
        { id: 161, name: 'オタチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/161.png' },
        { id: 162, name: 'オオタチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/162.png' },
        { id: 163, name: 'ホーホー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/163.png' },
        { id: 164, name: 'ヨルノズク', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/164.png' },
        { id: 165, name: 'レディバ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/165.png' },
        { id: 166, name: 'レディアン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/166.png' },
        { id: 167, name: 'イトマル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/167.png' },
        { id: 168, name: 'アリアドス', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/168.png' },
        { id: 169, name: 'クロバット', types: ['poison', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/169.png' },
        { id: 170, name: 'チョンチー', types: ['water', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/170.png' },
        { id: 171, name: 'ランターン', types: ['water', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/171.png' },
        { id: 172, name: 'ピチュー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png' },
        { id: 173, name: 'ピィ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/173.png' },
        { id: 174, name: 'ププリン', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/174.png' },
        { id: 175, name: 'トゲピー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/175.png' },
        { id: 176, name: 'トゲチック', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/176.png' },
        { id: 177, name: 'ネイティ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/177.png' },
        { id: 178, name: 'ネイティオ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/178.png' },
        { id: 179, name: 'メリープ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/179.png' },
        { id: 180, name: 'モココ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/180.png' },
        { id: 181, name: 'デンリュウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/181.png' },
        { id: 181, name: 'メガデンリュウ', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10045.png' },
        { id: 182, name: 'キレイハナ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/182.png' },
        { id: 183, name: 'マリル', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/183.png' },
        { id: 184, name: 'マリルリ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png' },
        { id: 185, name: 'ウソッキー', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/185.png' },
        { id: 186, name: 'ニョロトノ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/186.png' },
        { id: 187, name: 'ハネッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/187.png' },
        { id: 188, name: 'ポポッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/188.png' },
        { id: 189, name: 'ワタッコ', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/189.png' },
        { id: 190, name: 'エイパム', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/190.png' },
        { id: 191, name: 'ヒマナッツ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/191.png' },
        { id: 192, name: 'キマワリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/192.png' },
        { id: 193, name: 'ヤンヤンマ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/193.png' },
        { id: 194, name: 'ウパー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/194.png' },
        { id: 194, name: 'ウパー(パルデアのすがた)', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10253.png' },
        { id: 195, name: 'ヌオー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/195.png' },
        { id: 196, name: 'エーフィ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/196.png' },
        { id: 197, name: 'ブラッキー', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/197.png' },
        { id: 198, name: 'ヤミカラス', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/198.png' },
        { id: 199, name: 'ヤドキング', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/199.png' },
        { id: 199, name: 'ヤドキング(ガラルのすがた)', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10172.png' },
        { id: 200, name: 'ムウマ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/200.png' },
        { id: 201, name: 'アンノーン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png' },
        { id: 202, name: 'ソーナンス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/202.png' },
        { id: 203, name: 'キリンリキ', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/203.png' },
        { id: 204, name: 'クヌギダマ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/204.png' },
        { id: 205, name: 'フォレトス', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/205.png' },
        { id: 206, name: 'ノコッチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/206.png' },
        { id: 207, name: 'グライガー', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/207.png' },
        { id: 208, name: 'ハガネール', types: ['steel', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/208.png' },
        { id: 208, name: 'メガハガネール', types: ['steel', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10072.png' },
        { id: 209, name: 'ブルー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/209.png' },
        { id: 210, name: 'グランブル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/210.png' },
        { id: 211, name: 'ハリーセン', types: ['water', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/211.png' },
        { id: 211, name: 'ハリーセン(ヒスイのすがた)', types: ['dark', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10234.png' },
        { id: 212, name: 'ハッサム', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/212.png' },
        { id: 212, name: 'メガハッサム', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10046.png' },
        { id: 213, name: 'ツボツボ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/213.png' },
        { id: 214, name: 'ヘラクロス', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/214.png' },
        { id: 214, name: 'メガヘラクロス', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10047.png' },
        { id: 215, name: 'ニューラ', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png' },
        { id: 215, name: 'ニューラ(ヒスイのすがた)', types: ['fighting', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10235.png' },
        { id: 216, name: 'ヒメグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/216.png' },
        { id: 217, name: 'リングマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/217.png' },
        { id: 218, name: 'マグマッグ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/218.png' },
        { id: 219, name: 'マグカルゴ', types: ['fire', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/219.png' },
        { id: 220, name: 'ウリムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/220.png' },
        { id: 221, name: 'イノムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/221.png' },
        { id: 222, name: 'サニーゴ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/222.png' },
        { id: 222, name: 'サニーゴ(ガラルのすがた)', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10173.png' },
        { id: 223, name: 'テッポウオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/223.png' },
        { id: 224, name: 'オクタン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/224.png' },
        { id: 225, name: 'デリバード', types: ['ice', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/225.png' },
        { id: 226, name: 'マンタイン', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/226.png' },
        { id: 227, name: 'エアームド', types: ['steel', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/227.png' },
        { id: 227, name: 'メガエアームド', types: ['steel', 'flying'], image: 'images/mega_skarmory.png' },
        { id: 228, name: 'デルビル', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png' },
        { id: 229, name: 'ヘルガー', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/229.png' },
        { id: 229, name: 'メガヘルガー', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10048.png' },
        { id: 230, name: 'キングドラ', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/230.png' },
        { id: 231, name: 'ゴマゾウ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/231.png' },
        { id: 232, name: 'ドンファン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/232.png' },
        { id: 233, name: 'ポリゴン2', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/233.png' },
        { id: 234, name: 'オドシシ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/234.png' },
        { id: 235, name: 'ドーブル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/235.png' },
        { id: 236, name: 'バルキー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/236.png' },
        { id: 237, name: 'カポエラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/237.png' },
        { id: 238, name: 'ムチュール', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/238.png' },
        { id: 239, name: 'エレキッド', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/239.png' },
        { id: 240, name: 'ブビィ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/240.png' },
        { id: 241, name: 'ミルタンク', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/241.png' },
        { id: 242, name: 'ハピナス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/242.png' },
        { id: 243, name: 'ライコウ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/243.png' },
        { id: 244, name: 'エンテイ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/244.png' },
        { id: 245, name: 'スイクン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png' },
        { id: 246, name: 'ヨーギラス', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/246.png' },
        { id: 247, name: 'サナギラス', types: ['rock', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/247.png' },
        { id: 248, name: 'バンギラス', types: ['rock', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/248.png' },
        { id: 248, name: 'メガバンギラス', types: ['rock', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10049.png' },
        { id: 249, name: 'ルギア', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/249.png' },
        { id: 250, name: 'ホウオウ', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png' },
        { id: 251, name: 'セレビィ', types: ['psychic', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/251.png' },
        // Generation 3
        { id: 252, name: 'キモリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png' },
        { id: 253, name: 'ジュプトル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/253.png' },
        { id: 254, name: 'ジュカイン', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/254.png' },
        { id: 254, name: 'メガジュカイン', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10065.png' },
        { id: 255, name: 'アチャモ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png' },
        { id: 256, name: 'ワカシャモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/256.png' },
        { id: 257, name: 'バシャーモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/257.png' },
        { id: 257, name: 'メガバシャーモ', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10050.png' },
        { id: 258, name: 'ミズゴロウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png' },
        { id: 259, name: 'ヌマクロー', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/259.png' },
        { id: 260, name: 'ラグラージ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/260.png' },
        { id: 260, name: 'メガラグラージ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10064.png' },
        { id: 261, name: 'ポチエナ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/261.png' },
        { id: 262, name: 'グラエナ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/262.png' },
        { id: 263, name: 'ジグザグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/263.png' },
        { id: 263, name: 'ジグザグマ(ガラルのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10174.png' },
        { id: 264, name: 'マッスグマ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/264.png' },
        { id: 264, name: 'マッスグマ(ガラルのすがた)', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10175.png' },
        { id: 265, name: 'ケムッソ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/265.png' },
        { id: 266, name: 'カラサリス', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/266.png' },
        { id: 267, name: 'アゲハント', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/267.png' },
        { id: 268, name: 'マユルド', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/268.png' },
        { id: 269, name: 'ドクケイル', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/269.png' },
        { id: 270, name: 'ハスボー', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/270.png' },
        { id: 271, name: 'ハスブレロ', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/271.png' },
        { id: 272, name: 'ルンパッパ', types: ['water', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/272.png' },
        { id: 273, name: 'タネボー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/273.png' },
        { id: 274, name: 'コノハナ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/274.png' },
        { id: 275, name: 'ダーテング', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/275.png' },
        { id: 276, name: 'スバメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/276.png' },
        { id: 277, name: 'オオスバメ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/277.png' },
        { id: 278, name: 'キャモメ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/278.png' },
        { id: 279, name: 'ペリッパー', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/279.png' },
        { id: 280, name: 'ラルトス', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/280.png' },
        { id: 281, name: 'キルリア', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/281.png' },
        { id: 282, name: 'サーナイト', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/282.png' },
        { id: 282, name: 'メガサーナイト', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10051.png' },
        { id: 283, name: 'アメタマ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/283.png' },
        { id: 284, name: 'アメモース', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/284.png' },
        { id: 285, name: 'キノココ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/285.png' },
        { id: 286, name: 'キノガッサ', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/286.png' },
        { id: 287, name: 'ナマケロ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/287.png' },
        { id: 288, name: 'ヤルキモノ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/288.png' },
        { id: 289, name: 'ケッキング', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/289.png' },
        { id: 290, name: 'ツチニン', types: ['bug', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/290.png' },
        { id: 291, name: 'テッカニン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/291.png' },
        { id: 292, name: 'ヌケニン', types: ['bug', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/292.png' },
        { id: 293, name: 'ゴニョニョ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/293.png' },
        { id: 294, name: 'ドゴーム', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/294.png' },
        { id: 295, name: 'バクオング', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/295.png' },
        { id: 296, name: 'マクノシタ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/296.png' },
        { id: 297, name: 'ハリテヤマ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/297.png' },
        { id: 298, name: 'ルリリ', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/298.png' },
        { id: 299, name: 'ノズパス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/299.png' },
        { id: 300, name: 'エネコ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/300.png' },
        { id: 301, name: 'エネコロロ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/301.png' },
        { id: 302, name: 'ヤミラミ', types: ['dark', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/302.png' },
        { id: 302, name: 'メガヤミラミ', types: ['dark', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10066.png' },
        { id: 303, name: 'クチート', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/303.png' },
        { id: 303, name: 'メガクチート', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10052.png' },
        { id: 304, name: 'ココドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/304.png' },
        { id: 305, name: 'コドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/305.png' },
        { id: 306, name: 'ボスゴドラ', types: ['steel', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/306.png' },
        { id: 306, name: 'メガボスゴドラ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10053.png' },
        { id: 307, name: 'アサナン', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/307.png' },
        { id: 308, name: 'チャーレム', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/308.png' },
        { id: 308, name: 'メガチャーレム', types: ['fighting', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10054.png' },
        { id: 309, name: 'ラクライ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/309.png' },
        { id: 310, name: 'ライボルト', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/310.png' },
        { id: 310, name: 'メガライボルト', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10055.png' },
        { id: 311, name: 'プラスル', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/311.png' },
        { id: 312, name: 'マイナン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/312.png' },
        { id: 313, name: 'バルビート', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/313.png' },
        { id: 314, name: 'イルミーゼ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/314.png' },
        { id: 315, name: 'ロゼリア', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/315.png' },
        { id: 316, name: 'ゴクリン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/316.png' },
        { id: 317, name: 'マルノーム', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/317.png' },
        { id: 318, name: 'キバニア', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/318.png' },
        { id: 319, name: 'サメハダー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/319.png' },
        { id: 319, name: 'メガサメハダー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10070.png' },
        { id: 320, name: 'ホエルコ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/320.png' },
        { id: 321, name: 'ホエルオー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/321.png' },
        { id: 322, name: 'ドンメル', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/322.png' },
        { id: 323, name: 'バクーダ', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/323.png' },
        { id: 323, name: 'メガバクーダ', types: ['fire', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10087.png' },
        { id: 324, name: 'コータス', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/324.png' },
        { id: 325, name: 'バネブー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/325.png' },
        { id: 326, name: 'ブーピッグ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/326.png' },
        { id: 327, name: 'パッチール', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/327.png' },
        { id: 328, name: 'ナックラー', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/328.png' },
        { id: 329, name: 'ビブラーバ', types: ['ground', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/329.png' },
        { id: 330, name: 'フライゴン', types: ['ground', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/330.png' },
        { id: 331, name: 'サボネア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/331.png' },
        { id: 332, name: 'ノクタス', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/332.png' },
        { id: 333, name: 'チルット', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/333.png' },
        { id: 334, name: 'チルタリス', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/334.png' },
        { id: 334, name: 'メガチルタリス', types: ['dragon', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10067.png' },
        { id: 335, name: 'ザングース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/335.png' },
        { id: 336, name: 'ハブネーク', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/336.png' },
        { id: 337, name: 'ルナトーン', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/337.png' },
        { id: 338, name: 'ソルロック', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/338.png' },
        { id: 339, name: 'ドジョッチ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/339.png' },
        { id: 340, name: 'ナマズン', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/340.png' },
        { id: 341, name: 'ヘイガニ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/341.png' },
        { id: 342, name: 'シザリガー', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/342.png' },
        { id: 343, name: 'ヤジロン', types: ['ground', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/343.png' },
        { id: 344, name: 'ネンドール', types: ['ground', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/344.png' },
        { id: 345, name: 'リリーラ', types: ['rock', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/345.png' },
        { id: 346, name: 'ユレイドル', types: ['rock', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/346.png' },
        { id: 347, name: 'アノプス', types: ['rock', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/347.png' },
        { id: 348, name: 'アーマルド', types: ['rock', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/348.png' },
        { id: 349, name: 'ヒンバス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/349.png' },
        { id: 350, name: 'ミロカロス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/350.png' },
        { id: 351, name: 'ポワルン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/351.png' },
        { id: 351, name: 'ポワルン(たいようのすがた)', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10013.png' },
        { id: 351, name: 'ポワルン(あまみずのすがた)', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10014.png' },
        { id: 351, name: 'ポワルン(ゆきぐものすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10015.png' },
        { id: 352, name: 'カクレオン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/352.png' },
        { id: 353, name: 'カゲボウズ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/353.png' },
        { id: 354, name: 'ジュペッタ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/354.png' },
        { id: 354, name: 'メガジュペッタ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10056.png' },
        { id: 355, name: 'ヨマワル', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/355.png' },
        { id: 356, name: 'サマヨール', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/356.png' },
        { id: 357, name: 'トロピウス', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/357.png' },
        { id: 358, name: 'チリーン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/358.png' },
        { id: 358, name: 'メガチリーン', types: ['psychic', 'steel'], image: 'images/mega_chimecho.png' },
        { id: 359, name: 'アブソル', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/359.png' },
        { id: 359, name: 'メガアブソル', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10057.png' },
        { id: 359, name: 'メガアブソルZ', types: ['dark', 'ghost'], image: 'images/mega_absol_z.png' },
        { id: 360, name: 'ソーナノ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/360.png' },
        { id: 361, name: 'ユキワラシ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/361.png' },
        { id: 362, name: 'オニゴーリ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/362.png' },
        { id: 362, name: 'メガオニゴーリ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10074.png' },
        { id: 363, name: 'タマザラシ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/363.png' },
        { id: 364, name: 'トドグラー', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/364.png' },
        { id: 365, name: 'トドゼルガ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/365.png' },
        { id: 366, name: 'パールル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/366.png' },
        { id: 367, name: 'ハンテール', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/367.png' },
        { id: 368, name: 'サクラビス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/368.png' },
        { id: 369, name: 'ジーランス', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/369.png' },
        { id: 370, name: 'ラブカス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/370.png' },
        { id: 371, name: 'タツベイ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/371.png' },
        { id: 372, name: 'コモルー', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/372.png' },
        { id: 373, name: 'ボーマンダ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png' },
        { id: 373, name: 'メガボーマンダ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10089.png' },
        { id: 374, name: 'ダンバル', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/374.png' },
        { id: 375, name: 'メタング', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/375.png' },
        { id: 376, name: 'メタグロス', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/376.png' },
        { id: 376, name: 'メガメタグロス', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10076.png' },
        { id: 377, name: 'レジロック', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/377.png' },
        { id: 378, name: 'レジアイス', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/378.png' },
        { id: 379, name: 'レジスチル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/379.png' },
        { id: 380, name: 'ラティアス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/380.png' },
        { id: 380, name: 'メガラティアス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10062.png' },
        { id: 381, name: 'ラティオス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/381.png' },
        { id: 381, name: 'メガラティオス', types: ['dragon', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10063.png' },
        { id: 382, name: 'カイオーガ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png' },
        { id: 382, name: 'ゲンシカイオーガ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10077.png' },
        { id: 383, name: 'グラードン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png' },
        { id: 383, name: 'ゲンシグラードン', types: ['ground', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10078.png' },
        { id: 384, name: 'レックウザ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png' },
        { id: 384, name: 'メガレックウザ', types: ['dragon', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10079.png' },
        { id: 385, name: 'ジラーチ', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/385.png' },
        { id: 386, name: 'デオキシス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/386.png' },
        // Generation 4
        { id: 387, name: 'ナエトル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png' },
        { id: 388, name: 'ハヤシガメ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/388.png' },
        { id: 389, name: 'ドダイトス', types: ['grass', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/389.png' },
        { id: 390, name: 'ヒコザル', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png' },
        { id: 391, name: 'モウカザル', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/391.png' },
        { id: 392, name: 'ゴウカザル', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/392.png' },
        { id: 393, name: 'ポッチャマ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png' },
        { id: 394, name: 'ポッタイシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/394.png' },
        { id: 395, name: 'エンペルト', types: ['water', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/395.png' },
        { id: 396, name: 'ムックル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/396.png' },
        { id: 397, name: 'ムクバード', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/397.png' },
        { id: 398, name: 'ムクホーク', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/398.png' },
        { id: 398, name: 'メガムクホーク', types: ['fighting', 'flying'], image: 'images/mega_staraptor.png' },
        { id: 399, name: 'ビッパ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/399.png' },
        { id: 400, name: 'ビーダル', types: ['normal', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/400.png' },
        { id: 401, name: 'コロボーシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/401.png' },
        { id: 402, name: 'コロトック', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/402.png' },
        { id: 403, name: 'コリンク', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/403.png' },
        { id: 404, name: 'ルクシオ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/404.png' },
        { id: 405, name: 'レントラー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/405.png' },
        { id: 406, name: 'スボミー', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/406.png' },
        { id: 407, name: 'ロズレイド', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/407.png' },
        { id: 408, name: 'ズガイドス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/408.png' },
        { id: 409, name: 'ラムパルド', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/409.png' },
        { id: 410, name: 'タテトプス', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/410.png' },
        { id: 411, name: 'トリデプス', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/411.png' },
        { id: 412, name: 'ミノムッチ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/412.png' },
        { id: 413, name: 'ミノマダム(くさきのミノ)', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/413.png' },
        { id: 413, name: 'ミノマダム(すなちのミノ)', types: ['bug', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10004.png' },
        { id: 413, name: 'ミノマダム(ゴミのミノ)', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10005.png' },
        { id: 414, name: 'ガーメイル', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/414.png' },
        { id: 415, name: 'ミツハニー', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/415.png' },
        { id: 416, name: 'ビークイン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/416.png' },
        { id: 417, name: 'パチリス', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/417.png' },
        { id: 418, name: 'ブイゼル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/418.png' },
        { id: 419, name: 'フローゼル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/419.png' },
        { id: 420, name: 'チェリンボ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/420.png' },
        { id: 421, name: 'チェリム', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/421.png' },
        { id: 422, name: 'カラナクシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/422.png' },
        { id: 423, name: 'トリトドン', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/423.png' },
        { id: 424, name: 'エテボース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/424.png' },
        { id: 425, name: 'フワンテ', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/425.png' },
        { id: 426, name: 'フワライド', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/426.png' },
        { id: 427, name: 'ミミロル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/427.png' },
        { id: 428, name: 'ミミロップ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/428.png' },
        { id: 428, name: 'メガミミロップ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10088.png' },
        { id: 429, name: 'ムウマージ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/429.png' },
        { id: 430, name: 'ドンカラス', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/430.png' },
        { id: 431, name: 'ニャルマー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/431.png' },
        { id: 432, name: 'ブニャット', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/432.png' },
        { id: 433, name: 'リーシャン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/433.png' },
        { id: 434, name: 'スカンプー', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/434.png' },
        { id: 435, name: 'スカタンク', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/435.png' },
        { id: 436, name: 'ドーミラー', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/436.png' },
        { id: 437, name: 'ドータクン', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/437.png' },
        { id: 438, name: 'ウソハチ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/438.png' },
        { id: 439, name: 'マネネ', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/439.png' },
        { id: 440, name: 'ピンプク', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/440.png' },
        { id: 441, name: 'ペラップ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/441.png' },
        { id: 442, name: 'ミカルゲ', types: ['ghost', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/442.png' },
        { id: 443, name: 'フカマル', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/443.png' },
        { id: 444, name: 'ガバイト', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/444.png' },
        { id: 445, name: 'ガブリアス', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png' },
        { id: 445, name: 'メガガブリアス', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10058.png' },
        { id: 446, name: 'ゴンベ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/446.png' },
        { id: 447, name: 'リオル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/447.png' },
        { id: 448, name: 'ルカリオ', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/448.png' },
        { id: 448, name: 'メガルカリオ', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10059.png' },
        { id: 448, name: 'メガルカリオZ', types: ['fighting', 'steel'], image: 'images/mega_lucario_z.png' },
        { id: 449, name: 'ヒポポタス', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/449.png' },
        { id: 450, name: 'カバルドン', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/450.png' },
        { id: 451, name: 'スコルピ', types: ['poison', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/451.png' },
        { id: 452, name: 'ドラピオン', types: ['poison', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/452.png' },
        { id: 453, name: 'グレッグル', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/453.png' },
        { id: 454, name: 'ドクロッグ', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/454.png' },
        { id: 455, name: 'マスキッパ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/455.png' },
        { id: 456, name: 'ケイコウオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/456.png' },
        { id: 457, name: 'ネオラント', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/457.png' },
        { id: 458, name: 'タマンタ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/458.png' },
        { id: 459, name: 'ユキカブリ', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/459.png' },
        { id: 460, name: 'ユキノオー', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/460.png' },
        { id: 460, name: 'メガユキノオー', types: ['grass', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10060.png' },
        { id: 461, name: 'マニューラ', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/461.png' },
        { id: 462, name: 'ジバコイル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/462.png' },
        { id: 463, name: 'ベロベルト', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/463.png' },
        { id: 464, name: 'ドサイドン', types: ['ground', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/464.png' },
        { id: 465, name: 'モジャンボ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/465.png' },
        { id: 466, name: 'エレキブル', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/466.png' },
        { id: 467, name: 'ブーバーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/467.png' },
        { id: 468, name: 'トゲキッス', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/468.png' },
        { id: 469, name: 'メガヤンマ', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/469.png' },
        { id: 470, name: 'リーフィア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/470.png' },
        { id: 471, name: 'グレイシア', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/471.png' },
        { id: 472, name: 'グライオン', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/472.png' },
        { id: 473, name: 'マンムー', types: ['ice', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/473.png' },
        { id: 474, name: 'ポリゴンZ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/474.png' },
        { id: 475, name: 'エルレイド', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/475.png' },
        { id: 475, name: 'メガエルレイド', types: ['psychic', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10068.png' },
        { id: 476, name: 'ダイノーズ', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/476.png' },
        { id: 477, name: 'ヨノワール', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/477.png' },
        { id: 478, name: 'ユキメノコ', types: ['ice', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/478.png' },
        { id: 478, name: 'メガユキメノコ', types: ['ice', 'ghost'], image: 'images/mega_froslass.png' },
        { id: 479, name: 'ロトム', types: ['electric', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/479.png' },
        { id: 479, name: 'ロトム(ヒートロトム)', types: ['electric', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10008.png' },
        { id: 479, name: 'ロトム(ウォッシュロトム)', types: ['electric', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10009.png' },
        { id: 479, name: 'ロトム(フロストロトム)', types: ['electric', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10010.png' },
        { id: 479, name: 'ロトム(スピンロトム)', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10011.png' },
        { id: 479, name: 'ロトム(カットロトム)', types: ['electric', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10012.png' },
        { id: 480, name: 'ユクシー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/480.png' },
        { id: 481, name: 'エムリット', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/481.png' },
        { id: 482, name: 'アグノム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/482.png' },
        { id: 483, name: 'ディアルガ', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png' },
        { id: 484, name: 'パルキア', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/484.png' },
        { id: 485, name: 'ヒードラン', types: ['fire', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/485.png' },
        { id: 485, name: 'メガヒードラン', types: ['fire', 'steel'], image: 'images/mega_heatran.png' },
        { id: 486, name: 'レジギガス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/486.png' },
        { id: 487, name: 'ギラティナ', types: ['ghost', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png' },
        { id: 488, name: 'クレセリア', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/488.png' },
        { id: 489, name: 'フィオネ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/489.png' },
        { id: 490, name: 'マナフィ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/490.png' },
        { id: 491, name: 'ダークライ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/491.png' },
        { id: 491, name: 'メガダークライ', types: ['dark'], image: 'images/mega_darkrai.png' },
        { id: 492, name: 'シェイミ(ランドフォルム)', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/492.png' },
        { id: 492, name: 'シェイミ(スカイフォルム)', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10006.png' },
        { id: 493, name: 'アルセウス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png' },
        // Generation 5
        { id: 494, name: 'ビクティニ', types: ['psychic', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/494.png' },
        { id: 495, name: 'ツタージャ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png' },
        { id: 496, name: 'ジャノビー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/496.png' },
        { id: 497, name: 'ジャローダ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/497.png' },
        { id: 498, name: 'ポカブ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png' },
        { id: 499, name: 'チャオブー', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/499.png' },
        { id: 500, name: 'エンブオー', types: ['fire', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/500.png' },
        { id: 500, name: 'メガエンブオー', types: ['fire', 'fighting'], image: 'images/mega_emboar.png' },
        { id: 501, name: 'ミジュマル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png' },
        { id: 502, name: 'フタチマル', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/502.png' },
        { id: 503, name: 'ダイケンキ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/503.png' },
        { id: 503, name: 'ダイケンキ(ヒスイのすがた)', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10236.png' },
        { id: 504, name: 'ミネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/504.png' },
        { id: 505, name: 'ミルホッグ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/505.png' },
        { id: 506, name: 'ヨーテリー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/506.png' },
        { id: 507, name: 'ハーデリア', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/507.png' },
        { id: 508, name: 'ムーランド', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/508.png' },
        { id: 509, name: 'チョロネコ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/509.png' },
        { id: 510, name: 'レパルダス', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/510.png' },
        { id: 511, name: 'ヤナップ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/511.png' },
        { id: 512, name: 'ヤナッキー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/512.png' },
        { id: 513, name: 'バオップ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/513.png' },
        { id: 514, name: 'バオッキー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/514.png' },
        { id: 515, name: 'ヒヤップ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/515.png' },
        { id: 516, name: 'ヒヤッキー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/516.png' },
        { id: 517, name: 'ムンナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/517.png' },
        { id: 518, name: 'ムシャーナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/518.png' },
        { id: 519, name: 'マメパト', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/519.png' },
        { id: 520, name: 'ハトーボー', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/520.png' },
        { id: 521, name: 'ケンホロウ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/521.png' },
        { id: 522, name: 'シママ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/522.png' },
        { id: 523, name: 'ゼブライカ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/523.png' },
        { id: 524, name: 'ダンゴロ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/524.png' },
        { id: 525, name: 'ガントル', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/525.png' },
        { id: 526, name: 'ギガイアス', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/526.png' },
        { id: 527, name: 'コロモリ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/527.png' },
        { id: 528, name: 'ココロモリ', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/528.png' },
        { id: 529, name: 'モグリュー', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/529.png' },
        { id: 530, name: 'ドリュウズ', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/530.png' },
        { id: 530, name: 'メガドリュウズ', types: ['ground', 'steel'], image: 'images/mega_excadrill.png' },
        { id: 531, name: 'タブンネ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/531.png' },
        { id: 531, name: 'メガタブンネ', types: ['normal', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10069.png' },
        { id: 532, name: 'ドッコラー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/532.png' },
        { id: 533, name: 'ドテッコツ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/533.png' },
        { id: 534, name: 'ローブシン', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/534.png' },
        { id: 535, name: 'オタマロ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/535.png' },
        { id: 536, name: 'ガマガル', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/536.png' },
        { id: 537, name: 'ガマゲロゲ', types: ['water', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/537.png' },
        { id: 538, name: 'ナゲキ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/538.png' },
        { id: 539, name: 'ダゲキ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/539.png' },
        { id: 540, name: 'クルミル', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/540.png' },
        { id: 541, name: 'クルマユ', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/541.png' },
        { id: 542, name: 'ハハコモリ', types: ['bug', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/542.png' },
        { id: 543, name: 'フシデ', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/543.png' },
        { id: 544, name: 'ホイーガ', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/544.png' },
        { id: 545, name: 'ペンドラー', types: ['bug', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/545.png' },
        { id: 545, name: 'メガペンドラー', types: ['bug', 'poison'], image: 'images/mega_scolipede.png' },
        { id: 546, name: 'モンメン', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/546.png' },
        { id: 547, name: 'エルフーン', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/547.png' },
        { id: 548, name: 'チュリネ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/548.png' },
        { id: 549, name: 'ドレディア', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/549.png' },
        { id: 549, name: 'ドレディア(ヒスイのすがた)', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10237.png' },
        { id: 550, name: 'バスラオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/550.png' },
        { id: 551, name: 'メグロコ', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/551.png' },
        { id: 552, name: 'ワルビル', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/552.png' },
        { id: 553, name: 'ワルビアル', types: ['ground', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/553.png' },
        { id: 554, name: 'ダルマッカ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/554.png' },
        { id: 554, name: 'ダルマッカ(ガラルのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10176.png' },
        { id: 555, name: 'ヒヒダルマ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/555.png' },
        { id: 555, name: 'ヒヒダルマ(ダルマモード)', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10017.png' },
        { id: 555, name: 'ヒヒダルマ(ガラルのすがた)', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10177.png' },
        { id: 555, name: 'ヒヒダルマ(ガラルのすがた)(ダルマモード)', types: ['ice', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10178.png' },
        { id: 556, name: 'マラカッチ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/556.png' },
        { id: 557, name: 'イシズマイ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/557.png' },
        { id: 558, name: 'イワパレス', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/558.png' },
        { id: 559, name: 'ズルッグ', types: ['dark', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/559.png' },
        { id: 560, name: 'ズルズキン', types: ['dark', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/560.png' },
        { id: 560, name: 'メガズルズキン', types: ['dark', 'fighting'], image: 'images/mega_scrafty.png' },
        { id: 561, name: 'シンボラー', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/561.png' },
        { id: 562, name: 'デスマス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/562.png' },
        { id: 562, name: 'デスマス(ガラルのすがた)', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10179.png' },
        { id: 563, name: 'デスカーン', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/563.png' },
        { id: 564, name: 'プロトーガ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/564.png' },
        { id: 565, name: 'アバゴーラ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/565.png' },
        { id: 566, name: 'アーケン', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/566.png' },
        { id: 567, name: 'アーケオス', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/567.png' },
        { id: 568, name: 'ヤブクロン', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/568.png' },
        { id: 569, name: 'ダストダス', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/569.png' },
        { id: 570, name: 'ゾロア', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/570.png' },
        { id: 570, name: 'ゾロア(ヒスイのすがた)', types: ['normal', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10238.png' },
        { id: 571, name: 'ゾロアーク', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png' },
        { id: 571, name: 'ゾロアーク(ヒスイのすがた)', types: ['normal', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10239.png' },
        { id: 572, name: 'チラーミィ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/572.png' },
        { id: 573, name: 'チラチーノ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/573.png' },
        { id: 574, name: 'ゴチム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/574.png' },
        { id: 575, name: 'ゴチミル', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/575.png' },
        { id: 576, name: 'ゴチルゼル', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/576.png' },
        { id: 577, name: 'ユニラン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/577.png' },
        { id: 578, name: 'ダブラン', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/578.png' },
        { id: 579, name: 'ランクルス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/579.png' },
        { id: 580, name: 'コアルヒー', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/580.png' },
        { id: 581, name: 'スワンナ', types: ['water', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/581.png' },
        { id: 582, name: 'バニプッチ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/582.png' },
        { id: 583, name: 'バニリッチ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/583.png' },
        { id: 584, name: 'バイバニラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/584.png' },
        { id: 585, name: 'シキジカ', types: ['normal', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/585.png' },
        { id: 586, name: 'メブキジカ', types: ['normal', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/586.png' },
        { id: 587, name: 'エモンガ', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/587.png' },
        { id: 588, name: 'カブルモ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/588.png' },
        { id: 589, name: 'シュバルゴ', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/589.png' },
        { id: 590, name: 'タマゲタケ', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/590.png' },
        { id: 591, name: 'モロバレル', types: ['grass', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/591.png' },
        { id: 592, name: 'プルリル', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/592.png' },
        { id: 593, name: 'ブルンゲル', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/593.png' },
        { id: 594, name: 'ママンボウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/594.png' },
        { id: 595, name: 'バチュル', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/595.png' },
        { id: 596, name: 'デンチュラ', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/596.png' },
        { id: 597, name: 'テッシード', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/597.png' },
        { id: 598, name: 'ナットレイ', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/598.png' },
        { id: 599, name: 'ギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/599.png' },
        { id: 600, name: 'ギギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/600.png' },
        { id: 601, name: 'ギギギアル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/601.png' },
        { id: 602, name: 'シビシラス', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/602.png' },
        { id: 603, name: 'シビビール', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/603.png' },
        { id: 604, name: 'シビルドン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/604.png' },
        { id: 604, name: 'メガシビルドン', types: ['electric'], image: 'images/mega_eelektross.png' },
        { id: 605, name: 'リグレー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/605.png' },
        { id: 606, name: 'オーベム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/606.png' },
        { id: 607, name: 'ヒトモシ', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/607.png' },
        { id: 608, name: 'ランプラー', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/608.png' },
        { id: 609, name: 'シャンデラ', types: ['ghost', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/609.png' },
        { id: 609, name: 'メガシャンデラ', types: ['ghost', 'fire'], image: 'images/mega_chandelure.png' },
        { id: 610, name: 'キバゴ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/610.png' },
        { id: 611, name: 'オノンド', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/611.png' },
        { id: 612, name: 'オノノクス', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/612.png' },
        { id: 613, name: 'クマシュン', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/613.png' },
        { id: 614, name: 'ツンベアー', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/614.png' },
        { id: 615, name: 'フリージオ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/615.png' },
        { id: 616, name: 'チョボマキ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/616.png' },
        { id: 617, name: 'アギルダー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/617.png' },
        { id: 618, name: 'マッギョ', types: ['ground', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/618.png' },
        { id: 618, name: 'マッギョ(ガラルのすがた)', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10180.png' },
        { id: 619, name: 'コジョフー', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/619.png' },
        { id: 620, name: 'コジョンド', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/620.png' },
        { id: 621, name: 'クリムガン', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/621.png' },
        { id: 622, name: 'ゴビット', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/622.png' },
        { id: 623, name: 'ゴルーグ', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/623.png' },
        { id: 623, name: 'メガゴルーグ', types: ['ground', 'ghost'], image: 'images/mega_golurk.png' },
        { id: 624, name: 'コマタナ', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/624.png' },
        { id: 625, name: 'キリキザン', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/625.png' },
        { id: 626, name: 'バッフロン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/626.png' },
        { id: 627, name: 'ワシボン', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/627.png' },
        { id: 628, name: 'ウォーグル', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/628.png' },
        { id: 628, name: 'ウォーグル(ヒスイのすがた)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10240.png' },
        { id: 629, name: 'バルチャイ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/629.png' },
        { id: 630, name: 'バルジーナ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/630.png' },
        { id: 631, name: 'クイタラン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/631.png' },
        { id: 632, name: 'アイアント', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/632.png' },
        { id: 633, name: 'モノズ', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/633.png' },
        { id: 634, name: 'ジヘッド', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/634.png' },
        { id: 635, name: 'サザンドラ', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png' },
        { id: 636, name: 'メラルバ', types: ['bug', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/636.png' },
        { id: 637, name: 'ウルガモス', types: ['bug', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/637.png' },
        { id: 638, name: 'コバルオン', types: ['steel', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/638.png' },
        { id: 639, name: 'テラキオン', types: ['rock', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/639.png' },
        { id: 640, name: 'ビリジオン', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/640.png' },
        { id: 641, name: 'トルネロス', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/641.png' },
        { id: 642, name: 'ボルトロス', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/642.png' },
        { id: 643, name: 'レシラム', types: ['dragon', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/643.png' },
        { id: 644, name: 'ゼクロム', types: ['dragon', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/644.png' },
        { id: 645, name: 'ランドロス', types: ['ground', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/645.png' },
        { id: 646, name: 'キュレム', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/646.png' },
        { id: 647, name: 'ケルディオ', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/647.png' },
        { id: 648, name: 'メロエッタ(ボイスフォルム)', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/648.png' },
        { id: 648, name: 'メロエッタ(ステップフォルム)', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10018.png' },
        { id: 649, name: 'ゲノセクト', types: ['bug', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/649.png' },
        // Generation 6
        { id: 650, name: 'ハリマロン', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png' },
        { id: 651, name: 'ハリボーグ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/651.png' },
        { id: 652, name: 'ブリガロン', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/652.png' },
        { id: 652, name: 'メガブリガロン', types: ['grass', 'fighting'], image: 'images/mega_chesnaught.png' },
        { id: 653, name: 'フォッコ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png' },
        { id: 654, name: 'テールナー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/654.png' },
        { id: 655, name: 'マフォクシー', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/655.png' },
        { id: 655, name: 'メガマフォクシー', types: ['fire', 'psychic'], image: 'images/mega_delphox.png' },
        { id: 656, name: 'ケロマツ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png' },
        { id: 657, name: 'ゲコガシラ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/657.png' },
        { id: 658, name: 'ゲッコウガ', types: ['water', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/658.png' },
        { id: 658, name: 'メガゲッコウガ', types: ['water', 'dark'], image: 'images/mega_greninja.png' },
        { id: 659, name: 'ホルビー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/659.png' },
        { id: 660, name: 'ホルード', types: ['normal', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/660.png' },
        { id: 661, name: 'ヤヤコマ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/661.png' },
        { id: 662, name: 'ヒノヤコマ', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/662.png' },
        { id: 663, name: 'ファイアロー', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/663.png' },
        { id: 664, name: 'コフキムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/664.png' },
        { id: 665, name: 'コフーライ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/665.png' },
        { id: 666, name: 'ビビヨン', types: ['bug', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/666.png' },
        { id: 667, name: 'シシコ', types: ['fire', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/667.png' },
        { id: 668, name: 'カエンジシ', types: ['fire', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/668.png' },
        { id: 668, name: 'メガカエンジシ', types: ['fire', 'normal'], image: 'images/mega_pyroar.png' },
        { id: 669, name: 'フラベベ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/669.png' },
        { id: 670, name: 'フラエッテ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/670.png' },
        { id: 670, name: 'メガフラエッテ', types: ['fairy'], image: 'images/mega_floette.png' },
        { id: 671, name: 'フラージェス', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/671.png' },
        { id: 672, name: 'メェークル', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/672.png' },
        { id: 673, name: 'ゴーゴート', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/673.png' },
        { id: 674, name: 'ヤンチャム', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/674.png' },
        { id: 675, name: 'ゴロンダ', types: ['fighting', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/675.png' },
        { id: 676, name: 'トリミアン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/676.png' },
        { id: 677, name: 'ニャスパー', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/677.png' },
        { id: 678, name: 'ニャオニクス', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/678.png' },
        { id: 678, name: 'メガニャオニクス', types: ['psychic'], image: 'images/mega_meowstic.png' },
        { id: 679, name: 'ヒトツキ', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/679.png' },
        { id: 680, name: 'ニダンギル', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/680.png' },
        { id: 681, name: 'ギルガルド', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/681.png' },
        { id: 682, name: 'シュシュプ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/682.png' },
        { id: 683, name: 'フレフワン', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/683.png' },
        { id: 684, name: 'ペロッパフ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/684.png' },
        { id: 685, name: 'ペロリーム', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/685.png' },
        { id: 686, name: 'マーイーカ', types: ['dark', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/686.png' },
        { id: 687, name: 'カラマネロ', types: ['dark', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/687.png' },
        { id: 687, name: 'メガカラマネロ', types: ['dark', 'psychic'], image: 'images/mega_malamar.png' },
        { id: 688, name: 'カメテテ', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/688.png' },
        { id: 689, name: 'ガメノデス', types: ['rock', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/689.png' },
        { id: 689, name: 'メガガメノデス', types: ['rock', 'fighting'], image: 'images/mega_barbaracle.png' },
        { id: 690, name: 'クズモー', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/690.png' },
        { id: 691, name: 'ドラミドロ', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/691.png' },
        { id: 691, name: 'メガドラミドロ', types: ['poison', 'dragon'], image: 'images/mega_dragalge.png' },
        { id: 692, name: 'ウデッポウ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/692.png' },
        { id: 693, name: 'ブロスター', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/693.png' },
        { id: 694, name: 'エリキテル', types: ['electric', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/694.png' },
        { id: 695, name: 'エレザード', types: ['electric', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/695.png' },
        { id: 696, name: 'チゴラス', types: ['rock', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/696.png' },
        { id: 697, name: 'ガチゴラス', types: ['rock', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/697.png' },
        { id: 698, name: 'アマルス', types: ['rock', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/698.png' },
        { id: 699, name: 'アマルルガ', types: ['rock', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/699.png' },
        { id: 700, name: 'ニンフィア', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/700.png' },
        { id: 701, name: 'ルチャブル', types: ['fighting', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/701.png' },
        { id: 701, name: 'メガルチャブル', types: ['fighting', 'flying'], image: 'images/mega_hawlucha.png' },
        { id: 702, name: 'デデンネ', types: ['electric', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/702.png' },
        { id: 703, name: 'メレシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/703.png' },
        { id: 704, name: 'ヌメラ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/704.png' },
        { id: 705, name: 'ヌメイル', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/705.png' },
        { id: 705, name: 'ヌメイル(ヒスイのすがた)', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10242.png' },
        { id: 706, name: 'ヌメルゴン', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/706.png' },
        { id: 706, name: 'ヌメルゴン(ヒスイのすがた)', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10243.png' },
        { id: 707, name: 'クレッフィ', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/707.png' },
        { id: 708, name: 'ボクレー', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/708.png' },
        { id: 709, name: 'オーロット', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/709.png' },
        { id: 710, name: 'バケッチャ', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/710.png' },
        { id: 711, name: 'パンプジン', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/711.png' },
        { id: 712, name: 'カチコール', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/712.png' },
        { id: 713, name: 'クレベース', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/713.png' },
        { id: 713, name: 'クレベース(ヒスイのすがた)', types: ['ice', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10244.png' },
        { id: 714, name: 'オンバット', types: ['flying', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/714.png' },
        { id: 715, name: 'オンバーン', types: ['flying', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/715.png' },
        { id: 716, name: 'ゼルネアス', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png' },
        { id: 717, name: 'イベルタル', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/717.png' },
        { id: 718, name: 'ジガルデ', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png' },
        { id: 718, name: 'メガジガルデ', types: ['dragon', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10120.png' },
        { id: 719, name: 'ディアンシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/719.png' },
        { id: 719, name: 'メガディアンシー', types: ['rock', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10075.png' },
        { id: 720, name: 'フーパ(いましめられしフーパ)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/720.png' },
        { id: 720, name: 'フーパ(ときはなたれしフーパ)', types: ['psychic', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10076.png' },
        { id: 721, name: 'ボルケニオン', types: ['fire', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/721.png' },
        // Generation 7
        { id: 722, name: 'モクロー', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png' },
        { id: 723, name: 'フクスロー', types: ['grass', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/723.png' },
        { id: 724, name: 'ジュナイパー', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/724.png' },
        { id: 724, name: 'ジュナイパー(ヒスイのすがた)', types: ['grass', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10244.png' },
        { id: 725, name: 'ニャビー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/725.png' },
        { id: 726, name: 'ニャヒート', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/726.png' },
        { id: 727, name: 'ガオガエン', types: ['fire', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/727.png' },
        { id: 728, name: 'アシマリ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png' },
        { id: 729, name: 'オシャマリ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/729.png' },
        { id: 730, name: 'アシレーヌ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/730.png' },
        { id: 731, name: 'ツツケラ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/731.png' },
        { id: 732, name: 'ケララッパ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/732.png' },
        { id: 733, name: 'ドデカバシ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/733.png' },
        { id: 734, name: 'ヤングース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/734.png' },
        { id: 735, name: 'デカグース', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/735.png' },
        { id: 736, name: 'アゴジムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/736.png' },
        { id: 737, name: 'デンヂムシ', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/737.png' },
        { id: 738, name: 'クワガノン', types: ['bug', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/738.png' },
        { id: 739, name: 'マケンカニ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/739.png' },
        { id: 740, name: 'ケケンカニ', types: ['fighting', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/740.png' },
        { id: 740, name: 'メガケケンカニ', types: ['fighting', 'ice'], image: 'images/mega_crabominable.png' },
        { id: 741, name: 'オドリドリ(めらめらスタイル)', types: ['fire', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/741.png' },
        { id: 741, name: 'オドリドリ(ぱちぱちスタイル)', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10123.png' },
        { id: 741, name: 'オドリドリ(ふらふらスタイル)', types: ['psychic', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10124.png' },
        { id: 741, name: 'オドリドリ(まいまいスタイル)', types: ['ghost', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10125.png' },
        { id: 742, name: 'アブリー', types: ['bug', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/742.png' },
        { id: 743, name: 'アブリボン', types: ['bug', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/743.png' },
        { id: 744, name: 'イワンコ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/744.png' },
        { id: 745, name: 'ルガルガン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/745.png' },
        { id: 746, name: 'ヨワシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/746.png' },
        { id: 747, name: 'ヒドイデ', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/747.png' },
        { id: 748, name: 'ドヒドイデ', types: ['poison', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/748.png' },
        { id: 749, name: 'ドロバンコ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/749.png' },
        { id: 750, name: 'バンバドロ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/750.png' },
        { id: 751, name: 'シズクモ', types: ['water', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/751.png' },
        { id: 752, name: 'オニシズクモ', types: ['water', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/752.png' },
        { id: 753, name: 'カリキリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/753.png' },
        { id: 754, name: 'ラランテス', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/754.png' },
        { id: 755, name: 'ネマシュ', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/755.png' },
        { id: 756, name: 'マシェード', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/756.png' },
        { id: 757, name: 'ヤトウモリ', types: ['poison', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png' },
        { id: 758, name: 'エンニュート', types: ['poison', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/758.png' },
        { id: 759, name: 'ヌイコグマ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/759.png' },
        { id: 760, name: 'キテルグマ', types: ['normal', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/760.png' },
        { id: 761, name: 'アマカジ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/761.png' },
        { id: 762, name: 'アママイコ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/762.png' },
        { id: 763, name: 'アマージョ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/763.png' },
        { id: 764, name: 'キュワワー', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/764.png' },
        { id: 765, name: 'ヤレユータン', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/765.png' },
        { id: 766, name: 'ナゲツケサル', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/766.png' },
        { id: 767, name: 'コソクムシ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/767.png' },
        { id: 768, name: 'グソクムシャ', types: ['bug', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/768.png' },
        { id: 768, name: 'メガグソクムシャ', types: ['bug', 'steel'], image: 'images/mega_golisopod.png' },
        { id: 769, name: 'スナバァ', types: ['ghost', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/769.png' },
        { id: 770, name: 'シロデスナ', types: ['ghost', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/770.png' },
        { id: 771, name: 'ナマコブシ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/771.png' },
        { id: 772, name: 'タイプ：ヌル', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/772.png' },
        { id: 773, name: 'シルヴァディ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/773.png' },
        { id: 774, name: 'メテノ', types: ['rock', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/774.png' },
        { id: 775, name: 'ネッコアラ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/775.png' },
        { id: 776, name: 'バクガメス', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/776.png' },
        { id: 777, name: 'トゲデマル', types: ['electric', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/777.png' },
        { id: 778, name: 'ミミッキュ', types: ['ghost', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/778.png' },
        { id: 779, name: 'ハギギシリ', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/779.png' },
        { id: 780, name: 'ジジーロン', types: ['normal', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/780.png' },
        { id: 780, name: 'メガジジーロン', types: ['normal', 'dragon'], image: 'images/mega_drampa.png' },
        { id: 781, name: 'ダダリン', types: ['ghost', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/781.png' },
        { id: 782, name: 'ジャラコ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/782.png' },
        { id: 783, name: 'ジャランゴ', types: ['dragon', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/783.png' },
        { id: 784, name: 'ジャラランガ', types: ['dragon', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/784.png' },
        { id: 785, name: 'カプ・コケコ', types: ['electric', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/785.png' },
        { id: 786, name: 'カプ・テテフ', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/786.png' },
        { id: 787, name: 'カプ・ブルル', types: ['grass', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/787.png' },
        { id: 788, name: 'カプ・レヒレ', types: ['water', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/788.png' },
        { id: 789, name: 'コスモッグ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/789.png' },
        { id: 790, name: 'コスモウム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/790.png' },
        { id: 791, name: 'ソルガレオ', types: ['psychic', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/791.png' },
        { id: 792, name: 'ルナアーラ', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/792.png' },
        { id: 793, name: 'ウツロイド', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/793.png' },
        { id: 794, name: 'マッシブーン', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/794.png' },
        { id: 795, name: 'フェローチェ', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/795.png' },
        { id: 796, name: 'デンジュモク', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/796.png' },
        { id: 797, name: 'テッカグヤ', types: ['steel', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/797.png' },
        { id: 798, name: 'カミツルギ', types: ['grass', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/798.png' },
        { id: 799, name: 'アクジキング', types: ['dark', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/799.png' },
        { id: 800, name: 'ネクロズマ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/800.png' },
        { id: 800, name: 'ネクロズマ(たそがれのたてがみ)', types: ['psychic', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10155.png' },
        { id: 800, name: 'ネクロズマ(あかつきのつばさ)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10156.png' },
        { id: 800, name: 'ネクロズマ(ウルトラネクロズマ)', types: ['psychic', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10157.png' },
        { id: 801, name: 'マギアナ', types: ['steel', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/801.png' },
        { id: 801, name: 'メガマギアナ', types: ['steel', 'fairy'], image: 'images/mega_magearna.png' },
        { id: 802, name: 'マーシャドー', types: ['fighting', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/802.png' },
        { id: 803, name: 'ベベノム', types: ['poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/803.png' },
        { id: 804, name: 'アーゴヨン', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/804.png' },
        { id: 805, name: 'ツンデツンデ', types: ['rock', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/805.png' },
        { id: 806, name: 'ズガドーン', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/806.png' },
        { id: 807, name: 'ゼラオラ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/807.png' },
        { id: 807, name: 'メガゼラオラ', types: ['electric'], image: 'images/mega_zeraora.png' },
        // Generation unknown
        { id: 808, name: 'メルタン', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/808.png' },
        { id: 809, name: 'メルメタル', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/809.png' },
        // Generation 8
        { id: 810, name: 'サルノリ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png' },
        { id: 811, name: 'バチンキー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/811.png' },
        { id: 812, name: 'ゴリランダー', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/812.png' },
        { id: 813, name: 'ヒバニー', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png' },
        { id: 814, name: 'ラビフット', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/814.png' },
        { id: 815, name: 'エースバーン', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/815.png' },
        { id: 816, name: 'メッソン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png' },
        { id: 817, name: 'ジメレオン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/817.png' },
        { id: 818, name: 'インテレオン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/818.png' },
        { id: 819, name: 'ホシガリス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/819.png' },
        { id: 820, name: 'ヨクバリス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/820.png' },
        { id: 821, name: 'ココガラ', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/821.png' },
        { id: 822, name: 'アオガラス', types: ['flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/822.png' },
        { id: 823, name: 'アーマーガア', types: ['flying', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/823.png' },
        { id: 824, name: 'サッチムシ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/824.png' },
        { id: 825, name: 'レドームシ', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/825.png' },
        { id: 826, name: 'イオルブ', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/826.png' },
        { id: 827, name: 'クスネ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/827.png' },
        { id: 828, name: 'フォクスライ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/828.png' },
        { id: 829, name: 'ヒメンカ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/829.png' },
        { id: 830, name: 'ワタシラガ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/830.png' },
        { id: 831, name: 'ウールー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/831.png' },
        { id: 832, name: 'バイウールー', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/832.png' },
        { id: 833, name: 'カムカメ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/833.png' },
        { id: 834, name: 'カジリガメ', types: ['water', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/834.png' },
        { id: 835, name: 'ワンパチ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/835.png' },
        { id: 836, name: 'パルスワン', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/836.png' },
        { id: 837, name: 'タンドン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/837.png' },
        { id: 838, name: 'トロッゴン', types: ['rock', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/838.png' },
        { id: 839, name: 'セキタンザン', types: ['rock', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/839.png' },
        { id: 840, name: 'カジッチュ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/840.png' },
        { id: 841, name: 'アップリュー', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/841.png' },
        { id: 842, name: 'タルップル', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/842.png' },
        { id: 843, name: 'スナヘビ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/843.png' },
        { id: 844, name: 'サダイジャ', types: ['ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/844.png' },
        { id: 845, name: 'ウッウ', types: ['flying', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/845.png' },
        { id: 846, name: 'サシカマス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/846.png' },
        { id: 847, name: 'カマスジョー', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/847.png' },
        { id: 848, name: 'エレズン', types: ['electric', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/848.png' },
        { id: 849, name: 'ストリンダー', types: ['electric', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/849.png' },
        { id: 850, name: 'ヤクデ', types: ['fire', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/850.png' },
        { id: 851, name: 'マルヤクデ', types: ['fire', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/851.png' },
        { id: 852, name: 'タタッコ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/852.png' },
        { id: 853, name: 'オトスパス', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/853.png' },
        { id: 854, name: 'ヤバチャ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/854.png' },
        { id: 855, name: 'ポットデス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/855.png' },
        { id: 856, name: 'ミブリム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/856.png' },
        { id: 857, name: 'テブリム', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/857.png' },
        { id: 858, name: 'ブリムオン', types: ['psychic', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/858.png' },
        { id: 859, name: 'ベロバー', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/859.png' },
        { id: 860, name: 'ギモー', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/860.png' },
        { id: 861, name: 'オーロンゲ', types: ['dark', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/861.png' },
        { id: 862, name: 'タチフサグマ', types: ['dark', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/862.png' },
        { id: 863, name: 'ニャイキング', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/863.png' },
        { id: 864, name: 'サニゴーン', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/864.png' },
        { id: 865, name: 'ネギガナイト', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/865.png' },
        { id: 866, name: 'バリコオル', types: ['ice', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/866.png' },
        { id: 867, name: 'デスバーン', types: ['ground', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/867.png' },
        { id: 868, name: 'マホミル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/868.png' },
        { id: 869, name: 'マホイップ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/869.png' },
        { id: 870, name: 'タイレーツ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/870.png' },
        { id: 870, name: 'メガタイレーツ', types: ['fighting'], image: 'images/mega_falinks.png' },
        { id: 871, name: 'バチンウニ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/871.png' },
        { id: 872, name: 'ユキハミ', types: ['ice', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/872.png' },
        { id: 873, name: 'モスノウ', types: ['ice', 'bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/873.png' },
        { id: 874, name: 'イシヘンジン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/874.png' },
        { id: 875, name: 'コオリッポ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/875.png' },
        { id: 876, name: 'イエッサン', types: ['psychic', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/876.png' },
        { id: 877, name: 'モルペコ', types: ['electric', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/877.png' },
        { id: 878, name: 'ゾウドウ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/878.png' },
        { id: 879, name: 'ダイオウドウ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/879.png' },
        { id: 880, name: 'パッチラゴン', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/880.png' },
        { id: 881, name: 'パッチルドン', types: ['electric', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/881.png' },
        { id: 882, name: 'ウオノラゴン', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/882.png' },
        { id: 883, name: 'ウオチルドン', types: ['water', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/883.png' },
        { id: 884, name: 'ジュラルドン', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/884.png' },
        { id: 885, name: 'ドラメシヤ', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/885.png' },
        { id: 886, name: 'ドロンチ', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/886.png' },
        { id: 887, name: 'ドラパルト', types: ['dragon', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png' },
        { id: 888, name: 'ザシアン(れきせんのゆうしゃ)', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png' },
        { id: 888, name: 'ザシアン(けんのおう)', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10188.png' },
        { id: 889, name: 'ザマゼンタ(れきせんのゆうしゃ)', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/889.png' },
        { id: 889, name: 'ザマゼンタ(たてのおう)', types: ['fighting', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10189.png' },
        { id: 890, name: 'ムゲンダイナ', types: ['poison', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/890.png' },
        { id: 891, name: 'ダクマ', types: ['fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/891.png' },
        { id: 892, name: 'ウーラオス(いちげきのかた)', types: ['fighting', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/892.png' },
        { id: 892, name: 'ウーラオス(れんげきのかた)', types: ['fighting', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10191.png' },
        { id: 893, name: 'ザルード', types: ['dark', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/893.png' },
        { id: 894, name: 'レジエレキ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/894.png' },
        { id: 895, name: 'レジドラゴ', types: ['dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/895.png' },
        { id: 896, name: 'ブリザポス', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/896.png' },
        { id: 897, name: 'レイスポス', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/897.png' },
        { id: 898, name: 'バドレックス', types: ['psychic', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/898.png' },
        { id: 898, name: 'バドレックス(はくばじょうのすがた)', types: ['psychic', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10193.png' },
        { id: 898, name: 'バドレックス(こくばじょうのすがた)', types: ['psychic', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10194.png' },
        // Generation hisui
        { id: 899, name: 'アヤシシ', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/899.png' },
        { id: 900, name: 'バサギリ', types: ['bug', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/900.png' },
        { id: 901, name: 'ガチグマ', types: ['ground', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/901.png' },
        { id: 902, name: 'イダイトウ', types: ['water', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/902.png' },
        { id: 903, name: 'オオニューラ', types: ['fighting', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/903.png' },
        { id: 904, name: 'ハリーマン', types: ['dark', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/904.png' },
        { id: 905, name: 'ラブトロス', types: ['fairy', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/905.png' },
        // Generation 9
        { id: 906, name: 'ニャオハ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png' },
        { id: 907, name: 'ニャローテ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/907.png' },
        { id: 908, name: 'マスカーニャ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/908.png' },
        { id: 909, name: 'ホゲータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png' },
        { id: 910, name: 'アチゲータ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/910.png' },
        { id: 911, name: 'ラウドボーン', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/911.png' },
        { id: 912, name: 'クワッス', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png' },
        { id: 913, name: 'ウェルカモ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/913.png' },
        { id: 914, name: 'ウェーニバル', types: ['water', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/914.png' },
        { id: 915, name: 'グルトン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/915.png' },
        { id: 916, name: 'パフュートン', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/916.png' },
        { id: 917, name: 'タマンチュラ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/917.png' },
        { id: 918, name: 'ワナイダー', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/918.png' },
        { id: 919, name: 'マメバッタ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/919.png' },
        { id: 920, name: 'エクスレッグ', types: ['bug', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/920.png' },
        { id: 921, name: 'パモ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/921.png' },
        { id: 922, name: 'パモット', types: ['electric', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/922.png' },
        { id: 923, name: 'パーモット', types: ['electric', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/923.png' },
        { id: 924, name: 'ワッカネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/924.png' },
        { id: 925, name: 'イッカネズミ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/925.png' },
        { id: 926, name: 'パピモッチ', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/926.png' },
        { id: 927, name: 'バウッツェル', types: ['fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/927.png' },
        { id: 928, name: 'ミニーブ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/928.png' },
        { id: 929, name: 'オリーニョ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/929.png' },
        { id: 930, name: 'オリーヴァ', types: ['grass', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/930.png' },
        { id: 931, name: 'イキリンコ', types: ['normal', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/931.png' },
        { id: 932, name: 'コジオ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/932.png' },
        { id: 933, name: 'ジオヅム', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/933.png' },
        { id: 934, name: 'キョジオーン', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/934.png' },
        { id: 935, name: 'カルボウ', types: ['fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/935.png' },
        { id: 936, name: 'グレンアルマ', types: ['fire', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/936.png' },
        { id: 937, name: 'ソウブレイズ', types: ['fire', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/937.png' },
        { id: 938, name: 'ズピカ', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/938.png' },
        { id: 939, name: 'ハラバリー', types: ['electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/939.png' },
        { id: 940, name: 'カイデン', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/940.png' },
        { id: 941, name: 'タイカイデン', types: ['electric', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/941.png' },
        { id: 942, name: 'オラチフ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/942.png' },
        { id: 943, name: 'マフィティフ', types: ['dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/943.png' },
        { id: 944, name: 'シルシュルー', types: ['poison', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/944.png' },
        { id: 945, name: 'タギングル', types: ['poison', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/945.png' },
        { id: 946, name: 'アノクサ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/946.png' },
        { id: 947, name: 'アノホラグサ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/947.png' },
        { id: 948, name: 'ノノクラゲ', types: ['ground', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/948.png' },
        { id: 949, name: 'リククラゲ', types: ['ground', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/949.png' },
        { id: 950, name: 'ガケガニ', types: ['rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/950.png' },
        { id: 951, name: 'カプサイジ', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/951.png' },
        { id: 952, name: 'スコヴィラン', types: ['grass', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/952.png' },
        { id: 952, name: 'メガスコヴィラン', types: ['grass', 'fire'], image: 'images/mega_scovillain.png' },
        { id: 953, name: 'シガロコ', types: ['bug'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/953.png' },
        { id: 954, name: 'ベラカス', types: ['bug', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/954.png' },
        { id: 955, name: 'ヒラヒナ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/955.png' },
        { id: 956, name: 'クエスパトラ', types: ['psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/956.png' },
        { id: 957, name: 'カヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/957.png' },
        { id: 958, name: 'ナカヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/958.png' },
        { id: 959, name: 'デカヌチャン', types: ['fairy', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/959.png' },
        { id: 960, name: 'ウミディグダ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/960.png' },
        { id: 961, name: 'ウミトリオ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/961.png' },
        { id: 962, name: 'オトシドリ', types: ['flying', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/962.png' },
        { id: 963, name: 'ナミイルカ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/963.png' },
        { id: 964, name: 'イルカマン', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/964.png' },
        { id: 965, name: 'ブロロン', types: ['steel', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/965.png' },
        { id: 966, name: 'ブロロローム', types: ['steel', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/966.png' },
        { id: 967, name: 'モトトカゲ', types: ['dragon', 'normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/967.png' },
        { id: 968, name: 'ミミズズ', types: ['steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/968.png' },
        { id: 969, name: 'キラーメ', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/969.png' },
        { id: 970, name: 'キラフロル', types: ['rock', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/970.png' },
        { id: 970, name: 'メガキラフロル', types: ['rock', 'poison'], image: 'images/mega_glimmora.png' },
        { id: 971, name: 'ボチ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/971.png' },
        { id: 972, name: 'ハカドッグ', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/972.png' },
        { id: 973, name: 'カラミンゴ', types: ['flying', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/973.png' },
        { id: 974, name: 'アルクジラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/974.png' },
        { id: 975, name: 'ハルクジラ', types: ['ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/975.png' },
        { id: 976, name: 'ミガルーサ', types: ['water', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/976.png' },
        { id: 977, name: 'ヘイラッシャ', types: ['water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/977.png' },
        { id: 978, name: 'シャリタツ', types: ['dragon', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/978.png' },
        { id: 978, name: 'メガシャリタツ(そったすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_curly.png' },
        { id: 978, name: 'メガシャリタツ(たれたすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_droopy.png' },
        { id: 978, name: 'メガシャリタツ(のびたすがた)', types: ['dragon', 'water'], image: 'images/mega_tatsugiri_stretchy.png' },
        { id: 979, name: 'コノヨザル', types: ['fighting', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/979.png' },
        { id: 980, name: 'ドオー', types: ['poison', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/980.png' },
        { id: 981, name: 'リキキリン', types: ['normal', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/981.png' },
        { id: 982, name: 'ノココッチ', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/982.png' },
        { id: 983, name: 'ドドゲザン', types: ['dark', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/983.png' },
        { id: 984, name: 'イダイナキバ', types: ['ground', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/984.png' },
        { id: 985, name: 'サケブシッポ', types: ['fairy', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/985.png' },
        { id: 986, name: 'アラブルタケ', types: ['grass', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/986.png' },
        { id: 987, name: 'ハバタクカミ', types: ['ghost', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/987.png' },
        { id: 988, name: 'チヲハウハネ', types: ['bug', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/988.png' },
        { id: 989, name: 'スナノケガワ', types: ['electric', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/989.png' },
        { id: 990, name: 'テツノワダチ', types: ['ground', 'steel'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/990.png' },
        { id: 991, name: 'テツノツツミ', types: ['ice', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/991.png' },
        { id: 992, name: 'テツノカイナ', types: ['fighting', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/992.png' },
        { id: 993, name: 'テツノコウベ', types: ['dark', 'flying'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/993.png' },
        { id: 994, name: 'テツノドクガ', types: ['fire', 'poison'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/994.png' },
        { id: 995, name: 'テツノイバラ', types: ['rock', 'electric'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/995.png' },
        { id: 996, name: 'セビエ', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/996.png' },
        { id: 997, name: 'セゴール', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/997.png' },
        { id: 998, name: 'セグレイブ', types: ['dragon', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/998.png' },
        { id: 998, name: 'メガセグレイブ', types: ['dragon', 'ice'], image: 'images/mega_baxcalibur.png' },
        { id: 999, name: 'コレクレー', types: ['ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/999.png' },
        { id: 1000, name: 'サーフゴー', types: ['steel', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png' },
        { id: 1001, name: 'チオンジェン', types: ['dark', 'grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1001.png' },
        { id: 1002, name: 'パオジアン', types: ['dark', 'ice'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1002.png' },
        { id: 1003, name: 'ディンルー', types: ['dark', 'ground'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1003.png' },
        { id: 1004, name: 'イーユイ', types: ['dark', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1004.png' },
        { id: 1005, name: 'トドロクツキ', types: ['dragon', 'dark'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1005.png' },
        { id: 1006, name: 'テツノブジン', types: ['fairy', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1006.png' },
        { id: 1007, name: 'コライドン', types: ['fighting', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1007.png' },
        { id: 1008, name: 'ミライドン', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png' },
        { id: 1009, name: 'ウネルミナモ', types: ['water', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1009.png' },
        { id: 1010, name: 'テツノイサハ', types: ['grass', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1010.png' },
        { id: 1011, name: 'カミッチュ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1011.png' },
        { id: 1012, name: 'チャデス', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1012.png' },
        { id: 1013, name: 'ヤバソチャ', types: ['grass', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1013.png' },
        { id: 1014, name: 'イイネイヌ', types: ['poison', 'fighting'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1014.png' },
        { id: 1015, name: 'マシマシラ', types: ['poison', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1015.png' },
        { id: 1016, name: 'キチキギス', types: ['poison', 'fairy'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1016.png' },
        { id: 1017, name: 'オーガポン(みどりのめん)', types: ['grass'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1017.png' },
        { id: 1017, name: 'オーガポン(いどのめん)', types: ['grass', 'water'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10273.png' },
        { id: 1017, name: 'オーガポン(かまどのめん)', types: ['grass', 'fire'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10274.png' },
        { id: 1017, name: 'オーガポン(いしずえのめん)', types: ['grass', 'rock'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/10275.png' },
        { id: 1018, name: 'ブリジュラス', types: ['steel', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1018.png' },
        { id: 1019, name: 'カミツオロチ', types: ['grass', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1019.png' },
        { id: 1020, name: 'ウガツホムラ', types: ['fire', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1020.png' },
        { id: 1021, name: 'タケルライコ', types: ['electric', 'dragon'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1021.png' },
        { id: 1022, name: 'テツノイワオ', types: ['rock', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1022.png' },
        { id: 1023, name: 'テツノカシラ', types: ['steel', 'psychic'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1023.png' },
        { id: 1024, name: 'テラパゴス', types: ['normal'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1024.png' },
        { id: 1025, name: 'モモワロウ', types: ['poison', 'ghost'], image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1025.png' },
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
    let loadedCount = 0;
    const BATCH_SIZE = 50;
    let observer = null;
    let currentPokemonList = pokemonData;
    let isOmakaseMode = false;
    let currentType1Filter = 'all';
    let currentType2Filter = 'all';
    let currentRegionFilter = 'all';
    let currentMode = 'full'; // 'full', 'omakase', 'type'
    let player1SelectedTypes = []; // For Type Mode
    let player2SelectedTypes = []; // For Type Mode

    const GENERATION_RANGES = {
        'all': { min: 0, max: 100000 },
        'gen1': { min: 1, max: 151 },
        'gen2': { min: 152, max: 251 },
        'gen3': { min: 252, max: 386 },
        'gen4': { min: 387, max: 493 },
        'gen5': { min: 494, max: 649 },
        'gen6': { min: 650, max: 721 },
        'gen7': { min: 722, max: 807 },
        'unknown': { min: 808, max: 809 },
        'gen8': { min: 810, max: 905 },
        'gen9': { min: 906, max: 1025 },
        'hisui': { min: 899, max: 905 } // Special Handling usually, but adhering to IDs here
    };

    // -- Init --
    initGame();

    function initGame() {
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        currentPokemonList = pokemonData;
        renderPokemonGrid();
        restartBtn.addEventListener('click', resetGame);
        pokemonSearchInput.addEventListener('input', handleSearchInput);
        pokemonSearchInput.addEventListener('blur', () => {
            // Delay to allow click on suggestion
            setTimeout(() => hideSuggestions(), 200);
        });

        document.getElementById('region-filter').addEventListener('change', handleRegionChange);
        document.getElementById('type1-filter').addEventListener('change', handleType1Change);
        document.getElementById('type2-filter').addEventListener('change', handleType2Change);
        document.getElementById('mode-select').addEventListener('change', handleModeChange);

        // Type button click handlers for Type Mode
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', handleTypeButtonClick);
        });
        document.getElementById('type-confirm-btn').addEventListener('click', confirmTypeSelection);

        document.getElementById('cancel-selection-btn').addEventListener('click', () => {
            // Only clear tentative selection, not full game reset unless intended
            // For now, clear current selection.
            clearSelection();
            selectedPokemon = null;
            updateInstruction();
            // Important: If resetting "Random Card" selection, reset its content too 
            const randomCard = document.getElementById('random-card');
            if (randomCard && !randomCard.classList.contains('random-card')) {
                resetRandomCard(randomCard);
            }
        });

        updateInstruction();
    }

    function handleModeChange(e) {
        const mode = e.target.value;
        currentMode = mode;
        isOmakaseMode = (mode === 'omakase');
        const pokemonGrid = document.getElementById('pokemon-grid');
        const typeGrid = document.getElementById('type-selection-grid');
        const searchContainer = document.querySelector('.pokemon-search-container');
        const filterElements = searchContainer.querySelectorAll('select:not(#mode-select), input, .type-filters-wrapper');

        // Reset selections
        clearSelection();
        selectedPokemon = null;
        player1SelectedTypes = [];
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('selected'));

        if (mode === 'type') {
            // Type Mode: Show type grid, hide pokemon grid and filters
            pokemonGrid.classList.add('hidden');
            typeGrid.classList.remove('hidden');
            filterElements.forEach(el => el.style.display = 'none');
            document.body.classList.remove('omakase-active');
            pokemonGrid.classList.remove('disabled');
        } else {
            // Full or Omakase Mode: Show pokemon grid, hide type grid
            pokemonGrid.classList.remove('hidden');
            typeGrid.classList.add('hidden');
            filterElements.forEach(el => el.style.display = '');

            if (isOmakaseMode) {
                document.body.classList.add('omakase-active');
                pokemonGrid.classList.add('disabled');
            } else {
                document.body.classList.remove('omakase-active');
                pokemonGrid.classList.remove('disabled');
            }
        }
        updateInstruction();
    }
    function handleRegionChange(e) {
        currentRegionFilter = e.target.value;
        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function handleTypeButtonClick(e) {
        const btn = e.target;
        const type = btn.dataset.type;

        // Determine which player is selecting
        const isPlayer1Turn = player1SelectedTypes.length === 0 ||
            (player1SelectedTypes.length < 2 && player2SelectedTypes.length === 0);
        const isPlayer2Turn = player1SelectedTypes.length > 0 && !player1Pokemon;

        if (!player1Pokemon) {
            // Player 1 is still selecting
            if (btn.classList.contains('selected')) {
                // Deselect
                btn.classList.remove('selected');
                player1SelectedTypes = player1SelectedTypes.filter(t => t !== type);
            } else {
                // Select (max 2)
                if (player1SelectedTypes.length < 2) {
                    btn.classList.add('selected');
                    player1SelectedTypes.push(type);
                }
            }

            // If at least 1 type selected, allow confirmation
            if (player1SelectedTypes.length > 0) {
                // Show confirm button or auto-proceed on double-click
                // For now, use a single click to proceed after selection
            }
        } else {
            // Player 2 is selecting
            if (btn.classList.contains('selected') && !player1SelectedTypes.includes(type)) {
                // This is player 2's selection, deselect it
                btn.classList.remove('selected');
                player2SelectedTypes = player2SelectedTypes.filter(t => t !== type);
            } else if (!player1SelectedTypes.includes(type)) {
                // Select (max 2)
                if (player2SelectedTypes.length < 2) {
                    btn.classList.add('selected');
                    player2SelectedTypes.push(type);
                }
            }
        }

        updateInstruction();
    }

    function confirmTypeSelection() {
        if (currentMode !== 'type') return;

        if (!player1Pokemon && player1SelectedTypes.length > 0) {
            // Confirm player 1 selection
            player1Pokemon = {
                name: getTypeDisplayName(player1SelectedTypes),
                types: player1SelectedTypes,
                image: null,
                isTypeOnly: true
            };

            // Get player 1 name
            player1Name = player1NameInput.value.trim() || 'トレーナー 1';

            // Show player 2 name input
            player1NameGroup.classList.add('hidden');
            player2NameGroup.classList.remove('hidden');

            // Reset type button states for player 2
            document.querySelectorAll('.type-btn').forEach(btn => {
                if (!player1SelectedTypes.includes(btn.dataset.type)) {
                    btn.classList.remove('selected');
                }
            });

            updateInstruction();
        } else if (player1Pokemon && player2SelectedTypes.length > 0) {
            // Confirm player 2 selection and start battle
            const player2Pokemon = {
                name: getTypeDisplayName(player2SelectedTypes),
                types: player2SelectedTypes,
                image: null,
                isTypeOnly: true
            };

            player2Name = player2NameInput.value.trim() || 'トレーナー 2';

            startTypeBattle(player1Pokemon, player2Pokemon);
        }
    }

    function getTypeDisplayName(types) {
        const typeNames = {
            'normal': 'ノーマル', 'fire': 'ほのお', 'water': 'みず', 'electric': 'でんき',
            'grass': 'くさ', 'ice': 'こおり', 'fighting': 'かくとう', 'poison': 'どく',
            'ground': 'じめん', 'flying': 'ひこう', 'psychic': 'エスパー', 'bug': 'むし',
            'rock': 'いわ', 'ghost': 'ゴースト', 'dragon': 'ドラゴン', 'dark': 'あく',
            'steel': 'はがね', 'fairy': 'フェアリー'
        };
        return types.map(t => typeNames[t]).join(' / ');
    }

    function startTypeBattle(p1, p2) {
        selectionScreen.classList.remove('active');
        selectionScreen.classList.add('hidden');
        battleScreen.classList.remove('hidden');
        battleScreen.classList.add('active');

        // Display type cards instead of Pokemon
        displayTypeFighter(playerFighterEl, p1, player1Name);
        displayTypeFighter(cpuFighterEl, p2, player2Name);

        // Calculate result
        const { result, p1Multiplier, p2Multiplier } = calculateEffectiveness(p1.types, p2.types);

        // Display result
        displayResult(result, p1Multiplier, p2Multiplier);
    }

    function displayTypeFighter(element, fighter, name) {
        const typeBadges = fighter.types.map(type =>
            `<span class="type-badge ${type}">${getTypeDisplayName([type])}</span>`
        ).join('');

        element.innerHTML = `
            <div class="fighter-card type-fighter-card">
                <p class="fighter-name">${name}</p>
                <div class="type-fighter-types">
                    ${typeBadges}
                </div>
                <p class="fighter-pokemon-name">${fighter.name}</p>
            </div>
        `;
    }

    function handleType1Change(e) {
        currentType1Filter = e.target.value;
        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function handleType2Change(e) {
        currentType2Filter = e.target.value;
        pokemonSearchInput.value = '';
        applyAllFilters();
    }

    function applyAllFilters() {
        let filtered = pokemonData;

        // Apply region filter
        const region = currentRegionFilter;
        const range = GENERATION_RANGES[region];

        if (region === 'all') {
            // No region filter
        } else if (region === 'gen7') {
            filtered = filtered.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('アローラ'));
        } else if (region === 'gen8') {
            filtered = filtered.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('ガラル'));
        } else if (region === 'gen9') {
            filtered = filtered.filter(p => (p.id >= range.min && p.id <= range.max) || p.name.includes('パルデア'));
        } else if (region === 'hisui') {
            filtered = filtered.filter(p => (p.id >= 899 && p.id <= 905) || p.name.includes('ヒスイ'));
        } else {
            filtered = filtered.filter(p =>
                p.id >= range.min &&
                p.id <= range.max &&
                !p.name.includes('アローラ') &&
                !p.name.includes('ガラル') &&
                !p.name.includes('パルデア') &&
                !p.name.includes('ヒスイ')
            );
        }

        // Apply type 1 filter
        if (currentType1Filter !== 'all') {
            filtered = filtered.filter(p => p.types.includes(currentType1Filter));
        }

        // Apply type 2 filter
        if (currentType2Filter !== 'all') {
            if (currentType2Filter === 'none') {
                // Only single-type Pokemon
                filtered = filtered.filter(p => p.types.length === 1);
            } else {
                filtered = filtered.filter(p => p.types.includes(currentType2Filter));
            }
        }

        currentPokemonList = filtered;
        renderPokemonGrid(currentPokemonList);
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
        // Use currentPokemonList to respect the selected region filter
        const listToSample = currentPokemonList && currentPokemonList.length > 0 ? currentPokemonList : pokemonData;
        const randomIndex = Math.floor(Math.random() * listToSample.length);
        return listToSample[randomIndex];
    }

    function handleRandomSelect() {
        const randomCard = document.getElementById('random-card');

        if (selectedPokemon && randomCard.classList.contains('selected')) {
            // Already selected the random one - confirm it
            handlePokemonSelect(selectedPokemon, randomCard);
        } else {
            // No selection or different selection - pick a new random pokemon
            const randomPokemon = getRandomPokemon();

            // Allow selection logic to run
            handlePokemonSelect(randomPokemon, randomCard);
        }
    }

    function updateCardToPokemon(cardElement, pokemon) {
        cardElement.classList.remove('random-card');
        cardElement.innerHTML = getPokemonCardInnerHtml(pokemon);

        // Add close button listener
        const closeBtn = cardElement.querySelector('.card-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearSelection();
            });
        }
    }

    function resetRandomCard(cardElement) {
        cardElement.classList.add('random-card');
        cardElement.innerHTML = getRandomCardContent();
    }

    function getRandomCardContent() {
        return `
            <div class="monster-ball-icon">
                <div class="half-top"></div>
                <div class="half-bottom"></div>
                <div class="center-line"></div>
                <div class="center-circle"></div>
            </div>
            <h3>おまかせ</h3>
        `;
    }

    function getPokemonCardInnerHtml(pokemon) {
        const typeBadges = pokemon.types.map(type =>
            `<span class="type-badge bg-${type}">${translateType(type)}</span>`
        ).join('');

        return `
            <div class="card-close-btn">×</div>
            <span class="pokemon-number">No.${String(pokemon.id).padStart(3, '0')}</span>
            <img src="${pokemon.image}" alt="${pokemon.name}" loading="lazy">
            <h3>${pokemon.name}</h3>
            <div class="type-badges">${typeBadges}</div>
        `;
    }

    function renderPokemonGrid(list = null) {
        if (list) {
            currentPokemonList = list;
        } else if (!currentPokemonList) {
            currentPokemonList = pokemonData;
        }

        pokemonGrid.innerHTML = '';
        loadedCount = 0;

        // Add random card first
        const randomCard = document.createElement('div');
        randomCard.className = 'pokemon-card random-card';
        randomCard.id = 'random-card';
        randomCard.innerHTML = getRandomCardContent();
        randomCard.addEventListener('click', handleRandomSelect);
        pokemonGrid.appendChild(randomCard);

        setupObserver();
        loadNextBatch();
    }

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadNextBatch();
                }
            });
        }, { rootMargin: '200px' });
    }

    function loadNextBatch() {
        const nextBatch = currentPokemonList.slice(loadedCount, loadedCount + BATCH_SIZE);

        // Remove sentinel if it exists
        const sentinel = document.getElementById('grid-sentinel');
        if (sentinel) {
            observer.unobserve(sentinel);
            sentinel.remove();
        }

        nextBatch.forEach(pokemon => {
            const card = createPokemonCard(pokemon);
            pokemonGrid.appendChild(card);
        });

        loadedCount += nextBatch.length;

        // Add sentinel if there are more items
        if (loadedCount < currentPokemonList.length) {
            const newSentinel = document.createElement('div');
            newSentinel.id = 'grid-sentinel';
            newSentinel.style.gridColumn = '1 / -1';
            newSentinel.style.height = '20px';
            pokemonGrid.appendChild(newSentinel);
            observer.observe(newSentinel);
        }
    }

    function createPokemonCard(pokemon) {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.dataset.pokemonId = pokemon.id;
        card.innerHTML = getPokemonCardInnerHtml(pokemon);
        card.addEventListener('click', () => handlePokemonSelect(pokemon, card));

        // Add close button listener
        const closeBtn = card.querySelector('.card-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                clearSelection();
            });
        }

        return card;
    }

    function clearSelection() {
        const cards = pokemonGrid.querySelectorAll('.pokemon-card');
        cards.forEach(card => card.classList.remove('selected'));

        // Reset random card if it exists and was transformed
        const randomCard = document.getElementById('random-card');
        if (randomCard && !randomCard.classList.contains('random-card')) {
            resetRandomCard(randomCard);
        }

        // Reset state
        selectedPokemon = null;
        updateInstruction();
    }

    function handlePokemonSelect(pokemon, cardElement) {
        const randomCard = document.getElementById('random-card');

        if (player1Pokemon === null) {
            // Player 1's turn
            if (selectedPokemon === null || selectedPokemon.id !== pokemon.id) {
                // First click - select this pokemon
                clearSelection();
                selectedPokemon = pokemon;
                if (cardElement) {
                    cardElement.classList.add('selected');
                }

                // Show selection in random card
                if (randomCard) {
                    updateCardToPokemon(randomCard, pokemon);
                    randomCard.classList.add('selected');
                }

                instructionText.textContent = 'もういちど クリックで けってい！';

                // Show cancel button
                const cancelBtn = document.getElementById('cancel-selection-btn');
                if (cancelBtn) {
                    cancelBtn.classList.remove('hidden');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Second click - confirm selection
                player1Name = player1NameInput.value.trim() || 'Player 1';
                player1Pokemon = pokemon;
                selectedPokemon = null;
                clearSelection();

                // Switch to Player 2's name input
                player1NameGroup.classList.add('hidden');
                player2NameGroup.classList.remove('hidden');

                // Change header color for Player 2
                document.querySelector('.game-header').classList.add('player2-turn');

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

                // Show selection in random card
                if (randomCard) {
                    updateCardToPokemon(randomCard, pokemon);
                    randomCard.classList.add('selected');
                }

                instructionText.textContent = 'もういちど クリックで けってい！';

                // Show cancel button
                const cancelBtn = document.getElementById('cancel-selection-btn');
                if (cancelBtn) {
                    cancelBtn.classList.remove('hidden');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
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

        // Reset header color for battle
        document.querySelector('.game-header').classList.remove('player2-turn');

        // Update instruction
        instructionText.textContent = 'バトル スタート！';

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

        // Update instruction
        instructionText.textContent = 'しょうぶ あり！';

        let message = '';
        const gameHeader = document.querySelector('.game-header');

        if (result === 'win') {
            message = `${player1Name} のかち！`;
            resultMessage.style.color = '#F44336';

            // Player 1 Wins (Red)
            gameHeader.classList.remove('player2-turn');
            restartBtn.style.background = 'var(--primary-color)';

        } else if (result === 'lose') {
            message = `${player2Name} のかち！`;
            resultMessage.style.color = '#2196F3';

            // Player 2 Wins (Blue)
            gameHeader.classList.add('player2-turn');
            restartBtn.style.background = 'var(--secondary-color)';

        } else {
            message = 'ひきわけ';
            resultMessage.style.color = '#9E9E9E';

            // Draw - Gray Header and Button
            gameHeader.classList.remove('player2-turn');
            gameHeader.classList.add('draw-result');
            restartBtn.style.background = '#9E9E9E';
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

        // Reset header color
        document.querySelector('.game-header').classList.remove('player2-turn');
        document.querySelector('.game-header').classList.remove('draw-result');
        restartBtn.style.background = ''; // Reset button color

        player1NameInput.value = '';
        player2NameInput.value = '';
        pokemonSearchInput.value = '';
        hideSuggestions();

        // Reset game state
        player1Pokemon = null;
        player1Name = '';
        player2Name = '';
        selectedPokemon = null;
        clearSelection();

        // Reset Type Mode state
        player1SelectedTypes = [];
        player2SelectedTypes = [];
        document.querySelectorAll('.type-btn').forEach(btn => btn.classList.remove('selected'));

        // Restore correct UI based on current mode
        const pokemonGrid = document.getElementById('pokemon-grid');
        const typeGrid = document.getElementById('type-selection-grid');
        const searchContainer = document.querySelector('.pokemon-search-container');
        const filterElements = searchContainer.querySelectorAll('select:not(#mode-select), input, .type-filters-wrapper');

        if (currentMode === 'type') {
            pokemonGrid.classList.add('hidden');
            typeGrid.classList.remove('hidden');
            filterElements.forEach(el => el.style.display = 'none');
        } else {
            pokemonGrid.classList.remove('hidden');
            typeGrid.classList.add('hidden');
            filterElements.forEach(el => el.style.display = '');
        }

        updateInstruction();
    }
});
