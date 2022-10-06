import axios from 'axios';
import { ethers } from 'ethers'
import React,{Component} from 'react';
import { API_BASE_URL, PACKED_NONCE } from '../constants';
import { useState, useEffect } from "react";
import { CoinexIcon } from './coinexIcon';
import { hasEthereum } from '../utils/connectWallet';
import { getContractDetails } from '../utils/rest';

const DonateModal = (props) => {
  const [amountInCet, setAmountInCet] = useState(0);
  const { onClose } = props;

  const handleOnClose = (e) => {
    if (e.target.id === 'donateModalContainer') {
      onClose()
    }
  }

  const handleAmountInCetChange = event => {
    setAmountInCet(event.target.value);
    console.log('value is:', event.target.value);
  };

  const sendCet = async () => {
    if(!hasEthereum()) return
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      try {
        const contractDetail = await getContractDetails();
        const creatorAddress = contractDetail?.data?.data?.creator_info?.creator;
        if (!creatorAddress || creatorAddress.length === 0) return
        console.log('creator', creatorAddress)
        const tx = await signer.sendTransaction({
          to: creatorAddress,
          value: ethers.utils.parseEther(`${amountInCet}`)
        });
        console.log({ amountInCet });
        console.log("tx", tx);
      } catch(error) {
        console.log(error)
      }
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div 
      id="donateModalContainer"
      onClick={handleOnClose}
      className="fixed rounded backdrop-blur mt-[8rem] inset-0 items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-slate-100">
        <div className="py-6 px-9">
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              Donate Modal
            </label>
            <div className="mb-4 flex flex-col">
              <label htmlFor="amountInCet" className="mb-2 font-semibold">Amount (in CET)</label>
              <div className="relative">
                <CoinexIcon/>
                <input
                  type="number"
                  id="amountInCet"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1 pl-8 hover:border-blue-500 focus:outline-none focus:ring focus:ring-blue-500/40 active:ring active:ring-blue-500/40"
                  onChange={handleAmountInCetChange}  
                />
              </div>
            </div>
            <div>
            <button
              className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
              onClick={sendCet}
            >
              Send CET
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateModal;