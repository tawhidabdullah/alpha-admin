import React from 'react';
import ReactDOM from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import {
	QueryCache,
	ReactQueryCacheProvider,
} from 'react-query';
import App from './App';

// import redux store
import { store } from './state/store';

// import the main files of styles
import './styles/_main.scss';


// importing react hot loader for hot loading
import { AppContainer } from 'react-hot-loader';

const queryCache = new QueryCache()



// Wrap the rendering in a function:
const render = () => {
	ReactDOM.render(

		<ReduxProvider store={store}>
			<AppContainer>
				<ReactQueryCacheProvider queryCache={queryCache}>
					<App />
				</ReactQueryCacheProvider>

			</AppContainer>
		</ReduxProvider>
		,
		document.getElementById('root')
	);
};


// Render once
render();



// Webpack Hot Module Replacement API
if (module['hot']) {
	module['hot'].accept('./App', () => {
		render();
	});
}


