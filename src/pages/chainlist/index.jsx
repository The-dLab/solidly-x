import { useMemo, useEffect, useState } from 'react'
import classes from './chainlist.module.css'
import Chain from '../../components/chain'
import { useSearch, useTestnets } from '../../stores'
import { fetcher } from '../../utils/utils'
import allExtraRpcs from '../../utils/extraRpcs.json'
import { chainIds } from '../../components/chains'
import { QueryClientProvider, QueryClient } from 'react-query'
import * as Fathom from 'fathom-client'

function removeEndingSlash(rpc) {
  return rpc.endsWith('/') ? rpc.substr(0, rpc.length - 1) : rpc
}

export async function getStaticProps({ params }) {
  const chains = await fetcher('https://chainid.network/chains.json')
  const chainTvls = await fetcher('https://api.llama.fi/chains')

  function populateChain(chain) {
    const extraRpcs = allExtraRpcs[chain.name]?.rpcs
    if (extraRpcs !== undefined) {
      const rpcs = new Set(chain.rpc.map(removeEndingSlash).filter((rpc) => !rpc.includes('${INFURA_API_KEY}')))
      extraRpcs.forEach((rpc) => rpcs.add(removeEndingSlash(rpc)))
      chain.rpc = Array.from(rpcs)
    }
    const chainSlug = chainIds[chain.chainId]
    if (chainSlug !== undefined) {
      const defiChain = chainTvls.find((c) => c.name.toLowerCase() === chainSlug)
      return defiChain === undefined
        ? chain
        : {
            ...chain,
            tvl: defiChain.tvl,
            chainSlug,
          }
    }
    return chain
  }

  const sortedChains = chains
    .filter((c) => c.name !== '420coin') // same chainId as ronin
    .map(populateChain)
    .sort((a, b) => {
      return (b.tvl ?? 0) - (a.tvl ?? 0)
    })

  return {
    props: {
      sortedChains,
    },
    revalidate: 3600,
  }
}

function Chainlist({ sortedChains }) {
  const [queryClient] = useState(() => new QueryClient())
  const search = useSearch((state) => state.search)
  const testnets = useTestnets((state) => state.testnets)

  // useEffect(function () {
  //   stores.dispatcher.dispatch({ type: CONFIGURE })
  // }, [])

  useEffect(() => {
    Fathom.load('TKCNGGEZ', {
      includedDomains: ['chainlist.defillama.com', 'chainlist.org'],
      url: 'https://surprising-powerful.llama.fi/script.js',
    })

    function onRouteChangeComplete() {
      Fathom.trackPageview()
    }
    // Record a pageview when route changes
    // router.events.on('routeChangeComplete', onRouteChangeComplete)

    // // Unassign event listener
    // return () => {
    //   router.events.off('routeChangeComplete', onRouteChangeComplete)
    // }
  }, [])

  const addNetwork = () => {
    window.open('https://github.com/ethereum-lists/chains', '_blank')
  }

  const addRpc = () => {
    window.open('https://github.com/DefiLlama/chainlist/blob/main/utils/extraRpcs.json', '_blank')
  }

  const chains = useMemo(() => {
    if (!testnets) {
      return sortedChains.filter((item) => {
        const testnet =
          item.name?.toLowerCase().includes('test') ||
          item.title?.toLowerCase().includes('test') ||
          item.network?.toLowerCase().includes('test')
        return !testnet
      })
    } else return sortedChains
  }, [testnets, sortedChains])
  return (
    <QueryClientProvider client={queryClient}>
      <div className={classes.ffContainer}>
        <div className={classes.listContainerDark}>
          <div className={classes.cardsContainer}>
            {(search === ''
              ? chains
              : chains.filter((chain) => {
                  //filter
                  return (
                    chain.chain.toLowerCase().includes(search.toLowerCase()) ||
                    chain.chainId.toString().toLowerCase().includes(search.toLowerCase()) ||
                    chain.name.toLowerCase().includes(search.toLowerCase()) ||
                    (chain.nativeCurrency ? chain.nativeCurrency.symbol : '')
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                })
            ).map((chain, idx) => {
              return <Chain chain={chain} key={idx} />
            })}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default Chainlist
