import asyncio
import json

from web3 import Web3

with open('Abis/indexToken.json') as f:
    index_abi = json.load(f)

with open('Abis/erc20.json') as f:
    erc20_abi = json.load(f)

w3 = Web3(Web3.HTTPProvider("https://ancient-young-brook.quiknode.pro/affa4931a6be96f4b93387c21f6e3ab564753ce7/"))

ic21_address = "0x1B5E16C5b20Fb5EE87C61fE9Afe735Cca3B21A65"
ic21_contract = w3.eth.contract(ic21_address, abi = index_abi)

async def main():
    components = ic21_contract.functions.getComponents().call()
    for component in components:
        erc20_contract = w3.eth.contract(address = component, abi = erc20_abi)
        symbol = erc20_contract.functions.symbol().call()
        decimals = erc20_contract.functions.decimals().call()
        units_per_token = ic21_contract.functions.getTotalComponentRealUnits(component).call()
        print (symbol, component, decimals, units_per_token)

asyncio.run(main())