import { render } from 'preact';
import './style.css';

import Header from './Header';
import CelebrityRecognition from './CelebrityRecognition';


export function App() {
	return (
		<div>
			<Header />
			<CelebrityRecognition />
		</div>
	);
}

render(<App />, document.getElementById('app'));
