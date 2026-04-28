const fs = require('fs');

const mappings = {
    'id="navigationapi_docs"': 'id="navigation/api_docs"',
    'id="navigationapi_keys"': 'id="navigation/api_keys"',
    'id="navigationapps"': 'id="navigation/apps"',
    'id="navigationblock"': 'id="navigation/block"',
    'id="navigationblockchain"': 'id="navigation/blockchain"',
    'id="navigationchain_stats"': 'id="navigation/chain_stats"',
    'id="navigationcross_chain_txs"': 'id="navigation/cross_chain_txs"',
    'id="navigationcustom_abi"': 'id="navigation/custom_abi"',
    'id="navigationdeposits"': 'id="navigation/deposits"',
    'id="navigationdex_tracker"': 'id="navigation/dex_tracker"',
    'id="navigationecosystems"': 'id="navigation/ecosystems"',
    'id="navigationgames"': 'id="navigation/games"',
    'id="navigationgas_tracker"': 'id="navigation/gas_tracker"',
    'id="navigationhot_contracts"': 'id="navigation/hot_contracts"',
    'id="navigationhourglass"': 'id="navigation/hourglass"',
    'id="navigationinternal_txns"': 'id="navigation/internal_txns"',
    'id="navigationmerits_with_dot"': 'id="navigation/merits_with_dot"',
    'id="navigationmerits"': 'id="navigation/merits"',
    'id="navigationmud"': 'id="navigation/mud"',
    'id="navigation\\name_services"': 'id="navigation/name_services"',
    'id="navigation\nname_services"': 'id="navigation/name_services"',
    'id="navigationoperation"': 'id="navigation/operation"',
    'id="navigationother"': 'id="navigation/other"',
    'id="navigationoutput_roots"': 'id="navigation/output_roots"',
    'id="navigationprivate_tags"': 'id="navigation/private_tags"',
    'id="navigationpublic_tags"': 'id="navigation/public_tags"',
    'id="navigationstats"': 'id="navigation/stats"',
    'id="navigation\\\\token_transfers"': 'id="navigation/token_transfers"',
    'id="navigation\\\\tokens"': 'id="navigation/tokens"',
    'id="navigation\\\\top_accounts"': 'id="navigation/top_accounts"',
    'id="navigation\\\\transactions"': 'id="navigation/transactions"',
    'id="navigation\\\\txn_batches"': 'id="navigation/txn_batches"',
    'id="navigationuptime"': 'id="navigation/uptime"',
    'id="navigationuser_op"': 'id="navigation/user_op"',
    'id="navigationvalidator"': 'id="navigation/validator"',
    'id="navigationverified_contracts"': 'id="navigation/verified_contracts"',
    'id="navigationwatchlist"': 'id="navigation/watchlist"',
    'id="navigationwithdrawals"': 'id="navigation/withdrawals"',
};

let content = fs.readFileSync('public/icons/sprite.fixed_v2.svg', 'utf8');

// Also deal with literal backslashes
content = content.replace(/id="navigation\\(tokens)"/g, 'id="navigation/$1"');
content = content.replace(/id="navigation\\(token_transfers)"/g, 'id="navigation/$1"');
content = content.replace(/id="navigation\\(top_accounts)"/g, 'id="navigation/$1"');
content = content.replace(/id="navigation\\(transactions)"/g, 'id="navigation/$1"');
content = content.replace(/id="navigation\\(txn_batches)"/g, 'id="navigation/$1"');

// also replace literal newline for name_services
content = content.replace(/id="navigation\name_services"/g, 'id="navigation/name_services"');
content = content.replace(/id="navigation\nname_services"/g, 'id="navigation/name_services"');

for (const [bad, good] of Object.entries(mappings)) {
    content = content.replace(bad, good);
}

fs.writeFileSync('public/icons/sprite.fixed_v3.svg', content);

let envs = fs.readFileSync('public/assets/envs.js', 'utf8');
envs = envs.replace('NEXT_PUBLIC_ICON_SPRITE_HASH: "fixed_v2"', 'NEXT_PUBLIC_ICON_SPRITE_HASH: "fixed_v3"');
fs.writeFileSync('public/assets/envs.js', envs);

console.log("Fixed v3 generated!");
