/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosResponse } from 'axios';
import React, { FC, useEffect, useState } from 'react';
import PokemonApiService from '../../api/pokemon/PokemonApiService';
import './PokemonView.scss';

interface StatsViewProps {
	dunder?: number;
	dander?: string;
}

export const PokemonView: FC<StatsViewProps> = () => {
	const [formSearchTerm, setFormSearchTerm] = useState<string | undefined>(
		undefined
	);
	const [pokemonCollection, setPokemonCollection] = useState<Pokemon[]>([]);

	const fetchData = async () => {
		const response: AxiosResponse = await PokemonApiService.getAll();

		response?.data.results.forEach(async (result: any) => {
			const pokemon = await PokemonApiService.getOne(result.name);

			setPokemonCollection((previous) => [
				...previous,
				{
					name: pokemon.data.name,
					img: pokemon.data.sprites.front_default,
				},
			]);
		});
	};

	useEffect(() => {
		(async () => {
			await fetchData();
		})();

		return () => {
			forScience(pokemonCollection);
		};
	}, []);

	const handleSearch = async () => {
		const response: AxiosResponse = await PokemonApiService.getOne(
			formSearchTerm!
		);

		setPokemonCollection([
			{
				name: response.data.name,
				img: response.data.sprites.front_default,
			},
		]);
	};

	return (
		<div>
			<div className='form'>
				<div>SJUKA STATS</div>
				<label>Pokemon </label>
				<input
					type='text'
					onKeyDown={(event) => {
						if (event.key.toLowerCase() === 'enter') {
							handleSearch();
						}
					}}
					onChange={(event) => setFormSearchTerm(event.target.value)}
				/>
				<button onClick={handleSearch}>GO</button>
			</div>
			<div className='result'>
				{pokemonCollection.length > 0 ? (
					pokemonCollection.map((pokemon, i) => (
						<div key={i} className='pokemon'>
							<h1>{pokemon.name}</h1>
							<img src={pokemon.img} alt='' />
						</div>
					))
				) : (
					<div>"{formSearchTerm}" Nothing Found</div>
				)}
			</div>
		</div>
	);
};

interface Pokemon {
	name: string;
	img: string;
}

function forScience(pokemonCollection: Pokemon[]): void {
	console.log('The things we do for G');
}
