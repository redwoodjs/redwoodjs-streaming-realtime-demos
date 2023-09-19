import { useState } from 'react'

import { NavLink, routes } from '@redwoodjs/router'
import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'

import AuctionCard from 'src/components/AuctionCard/AuctionCard'
import Drawer from 'src/components/Drawer/Drawer'
import GitHubCorner from 'src/components/GitHubCorner/GitHubCorner'
import NavDot from 'src/components/NavDot/NavDot'
import { HistoryContext } from 'src/layouts/DemoLayout/DemoLayout'
import { Constants } from 'src/utils/Constants'

const BID_ON_AUCTION = gql`
  mutation CreateBid($input: BidInput!) {
    bid(input: $input) {
      amount
    }
  }
`
const AUCTION_LIVE_QUERY = gql`
  query GetCurrentAuctionBids($id: ID!) @live {
    auction(id: $id) {
      bids {
        amount
      }
      highestBid {
        amount
      }
      id
      title
    }
  }
`

const AuctionPage = ({ id }) => {
  // when clicking Bid, this is the amount that will be bid
  const [bidAmount, setBidAmount] = useState(10)

  // Auction history
  const history = React.useContext(HistoryContext)

  // Get the current auction with a @live query directive to receive updates in real time when a new bid is placed
  const { data } = useQuery(AUCTION_LIVE_QUERY, {
    variables: { id },
    onCompleted(data) {
      history.unshift(data.auction)
    },
  })

  // Mutation to bid on an auction
  const [create] = useMutation(BID_ON_AUCTION)

  // When the Bid button is clicked, call the mutation
  const onBid = (data) => {
    create({
      variables: { input: data },
    })
  }

  return (
    <div className="bg-[#F1F2F4]">
      <MetaTags title="Auction" description="Auction page" />

      <Drawer>
        <pre>
          <HistoryContext.Consumer>
            {(value) => (
              <p key={`countdown-history-${value}`}>
                {JSON.stringify(value, null, 2)}
              </p>
            )}
          </HistoryContext.Consumer>
        </pre>
      </Drawer>

      <div className="flex max-h-screen min-h-screen flex-col justify-end pb-[80px]">
        <img
          src={`/images/shoes-${id}.jpg`}
          alt={data?.auction?.title}
          className="absolute -top-[100px] z-bg mx-auto w-full object-cover"
        />

        <div className="auction-grid">
          <div className="col-start-3 mb-8 flex flex-col gap-2">
            {data?.auction.bids?.map((bid, i) => (
              <AuctionCard
                key={`auction1-history-bids-${i}`}
                amount={bid.amount}
              />
            ))}
          </div>
        </div>
        <div className="auction-grid gap-x-16 rounded-3xl bg-white bg-opacity-70 pl-12 backdrop-blur-3xl">
          <h1 className="py-8 text-[80px] font-bold leading-none text-[#555C64]">
            {data?.auction?.title}
          </h1>
          <div className="flex items-center gap-x-4">
            <div className="relative">
              <input
                type="number"
                className="amount w-[218px] rounded-lg border-1 border-[#CDCDCD] px-10"
                defaultValue={bidAmount}
                onChange={(e) => setBidAmount(parseInt(e.target.value))}
              />
              <div className="dollar-sign absolute left-4 top-3">$</div>
            </div>
            <button
              className="text-4xl font-bold text-caribbeanGreen hover:text-black"
              onClick={() =>
                onBid({
                  auctionId: id,
                  amount: bidAmount,
                })
              }
            >
              Bid
            </button>
          </div>
          <div className="flex items-center justify-end gap-x-4 rounded-r-3xl bg-white pr-12">
            <h4 className="whitespace-nowrap text-xs font-bold uppercase text-[#AEAEAE]">
              Best Offer
            </h4>
            <div>
              <span className="dollar-sign">$</span>
              <span className="amount">{data?.auction?.highestBid.amount}</span>
            </div>
          </div>
        </div>
        <nav className="pb-2 pt-6">
          <ul className="flex justify-center gap-x-4">
            <li>
              <NavLink
                to={routes.auction({ id: '1' })}
                className="nav-dot"
                activeClassName="nav-dot--active"
              >
                <NavDot />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={routes.auction({ id: '2' })}
                className="nav-dot"
                activeClassName="nav-dot--active"
              >
                <NavDot />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={routes.auction({ id: '3' })}
                className="nav-dot"
                activeClassName="nav-dot--active"
              >
                <NavDot />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={routes.auction({ id: '4' })}
                className="nav-dot"
                activeClassName="nav-dot--active"
              >
                <NavDot />
              </NavLink>
            </li>
            <li>
              <NavLink
                to={routes.auction({ id: '5' })}
                className="nav-dot"
                activeClassName="nav-dot--active"
              >
                <NavDot />
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <a
        href={Constants.AUCTION_ANCHOR}
        target="_blank"
        rel="noreferrer"
        className="absolute right-0 top-0 z-grid"
      >
        <GitHubCorner />
      </a>
    </div>
  )
}

export default AuctionPage
