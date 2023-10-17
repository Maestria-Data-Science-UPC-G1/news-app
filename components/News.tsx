"use client";

import { useState } from 'react';
import { NetworkDiagram } from "./graph/NetworkDiagram"
import { Data, Node } from './graph/data';

const News = () => {
    const [graph, setGraph] = useState<Data>({ nodes: [], links: [] })
    const [loadingGraph, setLoadingGraph] = useState(false)
    const [search, setSearch] = useState("")
    const [lenNodes, setLenNodes] = useState(0)
    const [lenEdges, setLenEdges] = useState(0)
    const [news, setNews] = useState<Node[]>([]);

    const generateGraph = async () => {
        setLoadingGraph(true)
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL }/api/news?query=${search}`)
        const response = await result.json()
        const graphGenerated = response.data
        setGraph(graphGenerated)
        setLenNodes(graphGenerated.nodes.length)
        setLenEdges(graphGenerated.links.length)
        setNews(graphGenerated.nodes)
        setLoadingGraph(false)
    }

    return (
        <div className="bg-indigo-100">

            <form id='search-form'>
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
                        type="button"
                        className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => generateGraph()}
                    >
                        Search
                    </button>
                </div>
            </form>

            {loadingGraph ?
                <div className="text-center">Loading...</div> :
                <NetworkDiagram data={graph} width={800} height={550} />
            }

            <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <li className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600">Nodes: {lenNodes}</li>
                <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">Edges: {lenEdges}</li>
            </ul>


            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                            <th scope="col" className="px-6 py-3">
                                Link
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((node) => (
                            <tr key={node.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
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
                                <td className="px-6 py-4">
                                    <a href={node.url} target="_blank" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Go</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>



        </div>
    )
}

export default News