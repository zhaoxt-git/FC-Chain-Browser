const fs = require('fs');

const svgCodeMap = {
    // Map missing 'navigation/' prefix specifically for all known navigation icons
    'navigationapi_docs': 'navigation/api_docs',
    'navigationapi_keys': 'navigation/api_keys',
    'navigationapps': 'navigation/apps',
    'navigationblock': 'navigation/block',
    'navigationblockchain': 'navigation/blockchain',
    'navigationchain_stats': 'navigation/chain_stats',
    'navigationcross_chain_txs': 'navigation/cross_chain_txs',
    'navigationcustom_abi': 'navigation/custom_abi',
    'navigationdeposits': 'navigation/deposits',
    'navigationdex_tracker': 'navigation/dex_tracker',
    'navigationecosystems': 'navigation/ecosystems',
    'navigationgames': 'navigation/games',
    'navigationgas_tracker': 'navigation/gas_tracker',
    'navigationhot_contracts': 'navigation/hot_contracts',
    'navigationhourglass': 'navigation/hourglass',
    'navigationinternal_txns': 'navigation/internal_txns',
    'navigationmerits_with_dot': 'navigation/merits_with_dot',
    'navigationmerits': 'navigation/merits',
    'navigationmud': 'navigation/mud',
    'navigationoperation': 'navigation/operation',
    'navigationother': 'navigation/other',
    'navigationoutput_roots': 'navigation/output_roots',
    'navigationprivate_tags': 'navigation/private_tags',
    'navigationpublic_tags': 'navigation/public_tags',
    'navigationstats': 'navigation/stats',
    'navigationuptime': 'navigation/uptime',
    'navigationuser_op': 'navigation/user_op',
    'navigationvalidator': 'navigation/validator',
    'navigationverified_contracts': 'navigation/verified_contracts',
    'navigationwatchlist': 'navigation/watchlist',
    'navigationwithdrawals': 'navigation/withdrawals',
    'actionscopy': 'actions/copy',
    'socialtwitter': 'social/twitter',
    'socialgithub': 'social/github',
    // ... other folders, but focus on navigation
};

let content = fs.readFileSync('public/icons/sprite.b6f26f13.svg', 'utf8');

// The ultimate regex to capture ALL "id"s and replace them intelligently.
content = content.replace(/id="([^"]+)"/g, (match, idValue) => {
    // 1. Exact map
    if (svgCodeMap[idValue]) {
        return `id="${svgCodeMap[idValue]}"`;
    }
    
    // 2. Handle corrupted characters like \t, \n, \b inside the string by looking at char codes
    // For navigation/tokens, the char code contains 9 (tab)
    const codeArr = Array.from(idValue).map(c => c.charCodeAt(0));
    
    // if it starts with 'navigation' (n,a,v,i,g,a,t,i,o,n is 110, 97, 118, 105, 103, 97, 116, 105, 111, 110)
    // we can just reconstruct based on what characters are left!
    const str = String.fromCharCode(...codeArr);
    
    if (str.includes('okensx')) return `id="tokensxdai"`;
    if (str.includes('oken_transfers')) return `id="navigation/token_transfers"`;
    if (str.includes('okens')) return `id="navigation/tokens"`;
    if (str.includes('op_accounts')) return `id="navigation/top_accounts"`;
    if (str.includes('ransactions')) return `id="navigation/transactions"`;
    if (str.includes('xn_batches')) return `id="navigation/txn_batches"`;
    if (str.includes('ame_services')) return `id="navigation/name_services"`;
    
    if (str.includes('token-pocket')) return `id="wallets/token-pocket"`;
    
    // fallback to original if not matched
    return match;
});

fs.writeFileSync('public/icons/sprite.fixed_v4.svg', content);

let envs = fs.readFileSync('public/assets/envs.js', 'utf8');
envs = envs.replace(/NEXT_PUBLIC_ICON_SPRITE_HASH: "[^"]+"/, 'NEXT_PUBLIC_ICON_SPRITE_HASH: "fixed_v4"');
fs.writeFileSync('public/assets/envs.js', envs);

console.log("V4 SVG sprite fully repaired and mapped!");
