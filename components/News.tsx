"use client";

import { useState } from 'react';
import { NetworkDiagram } from "./graph/NetworkDiagram"
import { Data, Node } from './graph/data';
import Spinner from './Spinner';

const News = () => {
    const [graph, setGraph] = useState<Data>({ nodes: [], links: [] })
    const [loadingGraph, setLoadingGraph] = useState(false)
    const [search, setSearch] = useState("")
    const [lenNodes, setLenNodes] = useState(0)
    const [lenEdges, setLenEdges] = useState(0)
    const [news, setNews] = useState<Node[]>([]);
    const [selectedSentiment, setSelectedSentiment] = useState("all"); // Agregado: estado para almacenar el valor seleccionado del combo

    const generateGraph = async () => {
        setGraph({ nodes: [], links: [] })
        setLoadingGraph(true)
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news?query=${search}`)
        const response = await result.json()
        const graphGenerated = response.data
        setGraph(graphGenerated)
        setLenNodes(graphGenerated.nodes.length)
        setLenEdges(graphGenerated.links.length)
        setNews(graphGenerated.nodes)
        setLoadingGraph(false)
    }

    const handleSentimentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSentiment(e.target.value);
        // Aquí puedes realizar la acción deseada cuando cambie el valor del combo
        // Por ejemplo, puedes filtrar los nodos en base al nuevo valor seleccionado
        // y actualizar el estado news con los nodos filtrados
        const filteredNodes = graph.nodes.filter(node => {
            if (e.target.value === "all") {
                return true;
            } else {
                return node.sentiment === e.target.value;
            }
        });
        setNews(filteredNodes);
    }

    return (
        <div className="bg-indigo-100">

            <form id='search-form' onSubmit={(e) => { e.preventDefault(); generateGraph(); }}>
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for news" required
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Search
                    </button>
                </div>
            </form>

            {loadingGraph ?
                <Spinner /> :
                <NetworkDiagram data={graph} width={1000} height={600} />
            }

            <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">Nodes: {lenNodes}</li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Edges: {lenEdges}</li>
            </ul>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {loadingGraph ?
                    <Spinner /> :
                    <>
                        <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></label>
                                <select 
                                    id="countries" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={selectedSentiment}
                                    onChange={handleSentimentChange}
                                >
                                    <option value="all" selected>All sentiments</option>
                                    <option value="Positive">Positive</option>
                                    <option value="Negative">Negative</option>
                                    <option value="Neutral">Neutral</option>
                                </select>

                            </div>
                        </div>
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-2 py-3">
                                        ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Title
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Author
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Source
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Published
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Sentiment
                                    </th>
                                    <th scope="col" className="px-2 py-3">
                                        Link
                                    </th>
                                    <th scope="col" className="px-4 py-3">
                                        Similars
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map((node) => (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {node.id}
                                        </th>
                                        <td className="px-6 py-4">
                                            {node.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {node.author}
                                        </td>
                                        <td className="px-6 py-4">
                                            {node.group}
                                        </td>
                                        <td className="px-6 py-4">
                                            {node.published_at}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center">
                                                <div className={`h-2.5 w-2.5 rounded-full mr-2 ${node.sentiment === "Positive"
                                                    ? "bg-green-500"
                                                    : node.sentiment === "Negative"
                                                        ? "bg-red-500"
                                                        : "bg-blue-500"
                                                    }`}></div>{node.sentiment}
                                            </div>
                                        </td>
                                        <td className="px-2 py-4">
                                            <a href={node.url} target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Go</a>
                                        </td>
                                        <td className="items-center px-4 py-4 space-x-3">
                                            {node.similar.map((similar) => (
                                                <a href={similar.url} target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{similar.id}</a>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
            </div>
        </div>
    )
}

export default News