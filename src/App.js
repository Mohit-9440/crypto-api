import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import Coin from './Coin';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const App = () => {

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('')
  const [sortType, setSortType ] = useState('');

  useEffect(() => {
    axios
      .get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      )
      .then(res => {
        setCoins(res.data)
      }).catch(error => console.log(error));
  }, []);

  const handleChange = e => {
    setSearch(e.target.value)
  }
  
  const options = ['Name A-Z',    'Name Z-A',    'Low - High',    'High - Low',  ];
  
  const defaultOption = options[0];
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className='coin-app'>
      <div className='coin-search'>
        <h1 className='coin-text'> Search a currency</h1>
        <form>
          <input type="text" placeholder="Search" className='coin-input' onChange={handleChange}/>
        </form>
      
        <Dropdown className='dropdown' options={options} onChange={e => setSortType(e.value)} value={defaultOption} />
      </div>
      {filteredCoins.sort((a,b) => 
          sortType === 'Name A-Z' ? a.name.localeCompare(b.name) : 
          sortType === 'Name Z-A' ? b.name.localeCompare(a.name) :
          sortType === 'Low - High' ? a.current_price - b.current_price :
          sortType === 'High - Low' ? b.current_price - a.current_price :null
        ).map((coin) => {
        return (
          <Coin
            key={coin.id}
            name={coin.name} 
            image={coin.image}
            symbol={coin.symbol}
            marketcap={coin.market_cap}
            price={coin.current_price}
            priceChange= {coin.price_change_percentage_24h}
            volume={coin.total_volume}
          />
        )
      })}
    </div>
  );
}

export default App;
