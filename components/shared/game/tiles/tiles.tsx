import { 
  useState,
  useEffect,
  useRef } from "react";
import { 
  useDispatch,
  useTrackedState } from "@/store/tracked";
import { 
  Wrapper,
  Row,
  CollumnCell } from "./tiles.styled";
import { SrOnly } from "@/styled/shared/helpers";
import { Nux } from "./nux";
import { 
  useArrowKeys, 
  useCurrentGame } from "@/lib/hooks";
import { EVENTS } from "@/store/tracked/socket/events";


interface TilesProps {
  cpuMove: number | null
}

const Tiles = ({ cpuMove }: TilesProps) =>{
  const [ showNux, setShowNux ] = useState(false);
  const [ showNuxOnce, setShowNuxOne ] = useState(false);
  const moveLiveRegion = useRef<HTMLParagraphElement | null>(null);
  const mouseDown = useRef(false);
  const { tutorial, cpu, online } = useTrackedState();
  const dispatch = useDispatch();
  const { gameMode, currentGame } = useCurrentGame();
  const { components, currentIndex, registerArrow} = useArrowKeys<HTMLDivElement>(3);

  const handleAddMove = ( index: number) =>{
    currentIndex.current = index;

    if ( !currentGame ) return;
  
    switch(gameMode) {
      case "cpu":
        if ( currentGame.globalPlayer!==currentGame.currentPlayer || currentGame.winner.player || currentGame.board[index]) return;
        
        dispatch({ type: "ADD_MOVE", index, player: currentGame.globalPlayer});
        
        if ( moveLiveRegion.current ) {
          moveLiveRegion.current.textContent = `Placed ${currentGame.globalPlayer} at row ${Math.floor(index/3+1)} collumn ${index%3+1}.`;
        }

        break;
      case "local":
        if ( currentGame.winner.player || currentGame.board[index]) return;

        dispatch({ type: "ADD_MOVE", index, player: currentGame.currentPlayer });

        if ( moveLiveRegion.current ) {
          const player = `Player ${currentGame.globalPlayer===currentGame.currentPlayer? 1 : 2}`;
          moveLiveRegion.current.textContent = `${player} placed ${currentGame.currentPlayer} at row ${Math.floor(index/3+1)} collumn ${index%3+1}.`;
        }

        break;
      case "online":
        if ( currentGame.globalPlayer!==currentGame?.currentPlayer || currentGame.board[index] ) return;

        dispatch({ type: "ADD_MOVE", index, player: currentGame.globalPlayer });

        if ( moveLiveRegion.current ) {
          moveLiveRegion.current.textContent = `Placed ${currentGame.globalPlayer} at row ${Math.floor(index/3+1)} collumn ${index%3+1}.`;
        }
        
        const onlineMove = {
          move: index,
          player: currentGame.globalPlayer,
          roomId: online?.onGoingGame?.roomId
        }

        online?.socket.emit(EVENTS.CLIENT.GAME_ADD_MOVE, onlineMove);

        break;
    }
  }

  const handleGridCellKeydown = ( event: React.KeyboardEvent<HTMLDivElement>, itemIndex: number) =>{
    if ( event.code==="Space" || event.code==="Enter") {
      event.preventDefault();
      handleAddMove(itemIndex);
    }
  }

  const renderTiles = () =>{
    if ( !currentGame ) return;

    const boardMatrix = [0, 3, 6].map((tile, _) => currentGame.board.slice(tile, tile+3));
    const tiles = boardMatrix.map(( row, rowIndex ) =>(
      <Row 
        key={rowIndex} 
        id="index" 
        role="row">
        {row.map(( tile, tileIndex: number ) =>{
          const itemIndex = rowIndex*3 + tileIndex;

          return (
            <CollumnCell 
              key={tileIndex}
              role="gridcell"
              className={ currentGame.winner.indexes?.includes(itemIndex)? `win ${currentGame.currentPlayer}` : tile? "occupied" : ""}
              tabIndex={currentIndex.current===itemIndex? 0 : -1}
              onClick={() => handleAddMove(itemIndex)}
              onKeyDown={event => handleGridCellKeydown(event, itemIndex)}
              onMouseDown={() => mouseDown.current = true}
              onMouseUp={() => mouseDown.current = false}
              ref={ref => ref && components.current?.push(ref)}
              waveDelay={currentGame.winner.indexes?.includes(itemIndex)? .15*(tileIndex+1) : 0}
              gameStatus={{
                player: gameMode==="local"? currentGame.currentPlayer : currentGame.globalPlayer,
                winPlayer: currentGame.winner.player }}>
              { !tile? "" : tile==="X"? 
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 128 128"  xmlSpace="preserve">  <image id="image0" width="128px" height="128px" x="0" y="0"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
            AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAABa
            F0lEQVR42u2ddZwlxbX4v1Vt18Zd13XWjV1YYHGXeEKEEOOFQIiQAPlF3ou9eCB5SYgnjwjBg7v7
            ui+s+86Oz1xrq/r90XdmZ4aFhWyw5J3Pp+fe2/dOd3WdU6eOH8G/IQghQGiEACQIWTiPjE4Mgory
            ShAKUIUzErQE7QDQum/noO/eemC+0QN404AWBUqQRAgtIFUEhR8ohhJH+EaP+J8C/74EoCMuMPBe
            26CtaLWLoHAAwmNg1feDUMBgwnjrwr8vAQwBCdqMOMAAooMCMagCy49FbF8XpkwEHOAKb10ikId/
            ibco9K9+RIRgMQiJ2owQrkyCQGNbCVr39orejpTh9tUZ+d5qo3VfIFAp3upr6N+XAPphyIr3GFjV
            KgEqRdwppqS4wpIUi8qK2tCx46EQRpiKl8jW/Tve8vNnvNEDeN1ADD4Kb4RESI0QCmSIkAHRdhCD
            sBRUTIwY2Wi1tbX6sZijK6qKSg0r22zHc2jRlSmvSOne3i4JWh/O0N5IeAtQ8GsxxEH40sOuf0Dl
            M0DStr/LLymumBWLm3/K5TtXx5LBKmHmNpSUOT/YtXubADVUPRCvZOxy0PHGgjj8S7yWIGmobwIU
            yHx0SpsIYUWDFwJQhVc58Bmh0IU9PR5Pkc/nicVsPD9PGAQYpo3EIFQwc8ZMYvEYoLjur3+TCxYc
            Jbs6s2LmjCN83/NYuWrZZXk3+73a+gaRy+bYu28vFRUV+L6LIfQ3XTf3ldFjms3Hn3gkHDW6Uccd
            mzDQWEYJmUyOtvZWXiQkapN+5Pf0dvBGCpFvAQIYAQQgC/uzthEi2rlemgACtIzUNNtK4OZDpLQQ
            wkAIgVIBQmo8z2PPzn1i6vTpphBCjB071hPCwLZsli9fWSuEuCYI/HNKSitYsnyZiw7l+ElTZDad
            8ZJ2LB4EbkeogsnJlLl/3fpVcsLE8Wrb5m1iwrgWnclmsEyLPft2HHgcPWjV634C6OKNJIA3ngcd
            cmiFydFmQVc3h7FtOfS3Q/T4ANfNEXNSCMohrEH5VWzf2imKisutWCJuY9pi/ISp/uTJM71kqoI1
            a58fs3jpyq9ncu56y4mdU1ZWGSx57jF1wplnOE+uWmX9+ZYbjYlTWmLbtmxRxYniCqnlHOULRowY
            HWuoHWeOaDxKb92cNWpq6syQPhBZEHmGIrnA0eTw868/vOl1GCFDdL+MpQs6txjGuLQsPIoEHYIw
            gWjL2Lltr4AeUVwyQkybMl4sX75cjxo1KWzb3+pbtuS8932Qhx58pCEej5+hBO82DONIx4nFE6ki
            XnjhBT+fTltf/c6POe/jHyFZmqRjXwd2PIYQAlNIYnY8LwRYRiK7c0cbUldTUd4Y7t29l117dxnx
            eDwyGQ6w/UFE+iaAN/kWAI2N9Xi+h2M75PN5DFMQhiGW6QCSWCyGDi1QKbbv3C8sYcvJLeOlEfNZ
            s3aprqqqCgzDJtQCKQwUIKQuM0050/O8Iw3DWpRMJufallUsLZPOzi62Pb/GA2mcdM65xmWXXcas
            BbMIDNi2dz8vrFvH/7v08yqWC6TOBYTC/ERbd9fWZEl8XCpZNN+xysbkMtnuZEJ8X6ng0f2tnUao
            /ND1+kgkTQKVZfCq7+nOvKHz+6bnAJoQ0zCRIkE8lsR1MxhSE4vF8H2Xbdu3iDmzjjS7O0NZlEgE
            xcXlYV9fJpR5RVVFA6ZhYFlGuRf6k6UMj/A89ygDa2EsVlxVXlUBQGd3N+tWLglJJBXZjPjE5z9v
            L1q0iCMXHk2iOMaejm527t+HVpr1a9awa/NmOXPCFIykVK7Hr0oqq4gXmRiWRbbXx/MF6Wz+tMD1
            ZgErjzjiCHP1mqVBJttV2K3ki7WPNwjevAQwwJsUUiTJZxIIncAwihHkGNFcb/am24Vtx/y9+3b6
            aJPickldrWV1dnaPdv2wxXaMKUqrBWGoZ9pWrKa4rBzHccike1mxeoXCyyl0IDAQZ7zv3fKM088y
            Zs+eTfPIURTFLVxg2fMv0JfPITVoP2Tl0mXgenT29tDb2St7enoxLCv0/W4NJghbjBw5Np9IxpKB
            FVze3bPrvIce3qj8EFFVUa0Dv3/K5aDXN04OeJ0JYJhgNxgEkXouBn0GtLAQyqSnu0+gXalxRUVl
            Mnjh+S2BF6QpKSlBCDHRMFkA6qTe9P4ZpmWOTBQl48IwkaaJHyrWrFyjAR+A0Dfnn7BIHn3MQjl1
            xlQmTBhLXV09qVSSMNAIy6An7xOagurGWsLWVgwFbjrH6aefQaa7l/a9rVTUVlNSVEpFdYVRXl7C
            zJkzyfRmuOzSz1oTJ7YQBPlRhqUoSSZVd1dGZDMZbDtWeLBh5uc3CF5zGaCqqoIBSb2f7fV704Si
            uroaPwwJdEjcdtChitQ0S5PPBfR0hsaokePlqaee5vuBi2kK7rn7Pqu9vesYwxRnxuLmsaYpp5SV
            lVlKKXp6eujo6GLPri0KRIgwNAi56G3nGvPmzhVz5hzBiJEjGNHcFA1FRlMghBiQLbUAJSIyDThg
            NhKAVopcNktXRyfJWJxUqpiipIMJ2MAff/9nLvrI+e60mfOc9rbWWyZPGPv21r27bVOYuqmp2Q+0
            xvcDUqkkvh+wevUKHMdBSolSCjWMKDZt2vSa4ud14ACDVbQXf+v6HolEknw+TxCExONJfD/P2lUb
            5PhJ462PX/gh14knw96+Nm677eYZuXz+3WC+q6ysZqxtxZBmwI4d21i9cmkoY0VahSGVVVXios98
            QdSPaLLGT22htqmBiooKSktKkTJ6ZCkgDDUIgRQHgkIKIx3gUcbA+4gMpJRkvDztfT2EElp3dVBX
            VY3Ouzz18KNc9PGP6knTZ5hB6BGPxe62rDg11U2e6+Xo6Oq2hBS6rKw8CIKQdDpNcXExvu+jlCoQ
            oTig9bwO8DpwgJrCu4J7dZA6pISipq6WXCZLkW2jtKBPBRQVl1phzvXRJsniSqu9s/PdSroflpIT
            Y7EYiUSK3XvbwtYdOxUEsrSmWr7jHW9n1qxZYsaMGZSWllJeVUki5uAXkNidy1IST6CJQjn6Edzv
            HjiA4siyrwbNjB7yraC1o52tW7YghMT38nTsb+PnP76aNc8uZuTo0SScOJ2dnZhSbi5LFT+ayWRu
            dxznwerqyr6ioiKyuaz55BNPqqMWHqU2b96IZVkDHGD49vgvwAEGgR4qA0htYugERckkz69bJY46
            cr6R2bMnIDR8Lyfs7u7uj6mO3k+X11RMiNnF5Nw8G5Yud7EdY8KMGebnLv+8MXnyZMaOG01FeQVe
            4BN3HCzABToyGYqTSXzAtmzyKsSUxgDiB78OBzmI7w9GiQ3UV1TS3dnFvr17KSsvZdnixax59hmO
            PfV09u3YRXdvL4lEXPf29o3RgjGl5WUfCZXauWdf641if+uvRowYseHoRcfi511z+/atasSIUaqo
            qIienh4cx3pdUfL6yQCDAim01ggh8FxorJ/Irt17jRET6oSb6wlsJZDS/lhnj/vlVFnpiER5nDUb
            1oRu694QDOPCy79kHH3sQhYes5BY3MaQEVEdTJwazEgjGTOSMrUaHAc4FAYjvv8lBLLZPKZl4pjR
            c7hBwPKVKzFNwbZt27nofeeB54NSjG6ZFtksEMHOzRuVkyy2ZsyYLqQ0aG3dE2qt/2zb9tdGNY/Y
            tmnzCyQSSSuXy/qRnUOiwpCY7RCGIZs3b36LE0B1WQEbkRlXYKHx8YJebDPFmOajrZ6+nO8a3ViW
            e7Tb1fmdVKLoSCdVyd6u9mDPzvWivmWS/PxnvyiOOvJYxoypQ8hIOPP8HI4VGYQOBq+EAPp/1C8A
            DieAINA8+OAD3HDDDbzrHe/kpJNOwjYFvoZs3iXn51Chws3luOvvt/HkI4/z9JNPUZJKsXvPHj76
            0Y+yc8cOddfNN2hiST11WovpeR6e57tS883Ay38TpSktLbWz2YznBx46CFFKkUwm2bBhw1ubACpq
            ygAVTaxKQVCJbUvyYhONDaMt8pP9vbv6ZEmFe3Xeb724ujaF67r+mtUvyFETJxif/+rnOfLYoxlV
            30A+iBAn5OBABo1+iccYzBU0oPoJQL/YmiwPMhkS6OzsYUJNDdg2eD7vv/BCPvkf/8G0KRMB8AAX
            RRw5IE985EMXsGLZcrZs2MCfbryBE04+ieUrV3DNNb/ktv/9g6a4yJ89d67dtb8dP5N5KuHEzsvn
            89tLSkqsXCbjB36AbUo832Pr9u2DRjP4qV5GpX4V8JoHhCRScUAgtAXawTFTBEHGaGvfI1SgQmnU
            zIjHU3cr1Xd2VU0JS1Ys8fa3t9o/+OGP5fd/9APmzJ+NnUwSaIk0IFbYk/O+R97LYVrOS1KxPujn
            frVv6HcHkwk0YNkOndksKx59nJnHHst919/A7675JW1dPSgl6OnuRoeKTF+adavXcsffb+fpJ56k
            tKiYXfv2cv5HLmDc+LHUNjRwyqmncPTJJ4iunl7jiTvvDqtHjvQTdmJUti/7EWmYy8MgeKGxvtHc
            8Px6nUoW4TgO7R3tDOVww1gUh6cxHDYHaGlpOej5SIpWVFVXYBlJ8ukEqUSCdO92s6I8GUgt2bhl
            76WtPf5VtfWN5PI93ubnV5sXfPLj8tJLL2bkqDEIA3KGJiyEaYkhD10QJDFe0UP0T5MaNmHyEP+t
            gaXLVvLEww9xzU9/Rrqjm3EjR7F+zdrCGARjx41j+86dWIZJNtvHtGnTWbVyKRd8/EK+//OfEgzC
            nyklXd3d/PnPf+U/r/wyVZW1bm1FldPd3oljygvOOvPUPyxZ8pw5dcrkwDQM7r777oH51DpEK4HS
            B7SF7QMc4k1JAJK6umZMI4WftVmxfLExb35j6Ga66G73fxto6yPxihIWL37WRwjrD3+7jjPOOI0i
            R9Kb9bHiFq7oJ4CDDVi+CIHD18Xwz6+GABTga9i6bRt+NsueHTu57+938PD9D7JnywvEUmXY0sAw
            TUzHJpNOk8tn0X6Gyy7/Cp+/8nKMVJxwcES5EJgIevsybNiwkdOPOg40wfRZc8zutv1IEZ5/+qkn
            /u/9D9xvn3j8cd79991DpDKD1pGNIFIXAaHYvm3nm5gAVIzSktHYVopnFz9qHr1wdqDDDDt3bL7Z
            MGJvKymv8J9++inj7Pe+V37pK19mzNgx+EFAImHiKwgDBbZ4mV1OvEj8eznGqOgXBAf//uWnQAA9
            6Swbnl9PMpEg8Dza2trYvHETL6x/nq6ODtavX091RSXFxcXMnjOTkSNG8ra3vw0n5uBqNWBTUGFk
            7LGlgVEY4wsbtnHpxZew+OFHwmmz5xjp7g5MKU4747TT7rn179c70sy7/YEwWgu06t+1I3fy1q1v
            cgJoqJ/Cc88tN+Yd0RIqnWfjC2tvNCzjHVVVVe7iZx6zr/jGd8RHPnEh1dWlKKA34yGFIBa3CDUI
            qV+CAKKhv1ICUAPnXz0B5P2QLdu3sL+jHScew3EcXNfF931kqBFKY5tW9FlqKiorGT9mHDkvj23b
            A9fSKrq3UiG2aeMAvoK21g4u/dTFPHDLLf7MeQus3u5OTwXhEaeffsqKe+7+u40IPACt9cA1KDz9
            1q1v0i0AQAnJ+jXrhLBi4vgTTlNbt279pedlP1FeVeauWvyU/Y2rrhb/cfElaCEGVsnwXX64r+xQ
            TtRDEcCrhf7792Zz7N7fyt72/VgxZ8D+IFWIDDWmkHiej2UKRo4cRU1pOSaQO4goKgYRrwrBMQQ7
            d+5h1tSZxG3Hbapvdnq6unZVllZPy/Xprr37dhk1tVYojBwaNzIVKxsw2bp162Hh7zV2SiuOOeEY
            Y9EJx6odO7Z9RcEnymuqglXrV9tf+u5/i//49MWEEgIRGVv6Dz3kCm88SCCZiFNXU0NleQUqVOTy
            eYQG5YcorTFME8dxKC+vIBGPE3IgeeylZwcMQ+CjGd1Uz30P3Uemq9PRAjeWSDV2dqdvCAOb6qrm
            cMvWjUJKCpFE/j/12V470KbtmFXBnp3p93V2Z7/uxGN61TOPGRdd+mnxuS9cjgeEiAHb/KGONwL6
            720ARfE440eNYXRDE1XFZRi+IsjmEa6PqQUxYVBXUUWRE0eh8FFD0xE4sOX0E3nWyyIR9AUB02dN
            57ZHHuL5FUuc4ooyD4MTFOlvhKqP2XNnm8KM5CEtJUKGCHH4TqPDtgNUV1eiVAgIpLBBxaLLCmVr
            DK+jKz/TD8Q9ZZUlYsPq5eqsD35Afud730WaFgpdmKID0B8WcLBHGx4ywEv85mDwz/CvSSIvYkki
            QVlRCY5lYRkG5SWl1FRXU1leQVEqEbF2pSDUIMXLyhmmcQAFjpDUNjRQUd/En3/7ezl2wngd5r1j
            DRk+15vrfD7Qoa0xwv40dgF0dfUc1jMdNgE4CatgVjVAJJFUsntXpxFPyqAv0+34Qj9UVFZUuW7d
            Km/ynJnWVT+5muLSMlzXwzCtyBXLwQ79onMRiAECGfDevYLjH4Xh6mT/WExDkkomqKiooKS0BCfm
            YNsWmgLrFxIhJWhRCFd/MR/o5wUakEJGnFDDzJkz2NOxX9x/043+qFHjjGw6vcDV4a/Hjmtx16/f
            bowfO0WXFqcoLUmxffuuw8LfYW8BpiVQOkSFFqFn0d3Vgx/4OgzAisV/mSxOjsurvIsO7Gt+/StG
            jWxCSollWRiDBL+hSH5rwsG2KnHIh3oxClImfOELnwNL2nv373KTxUWjLSN+Zd4VzJlzrLDsEoQw
            MIzDN+QeHgEIsB2NISWhl8JzTeqbk1ZDc1wZRuzDliw5X2EGW5Y+a//2ur8wddJYcn6AlOCYh7LB
            vTngtSPM6MoRMz+ABq1D2nNZ6hrr+MutN7NnzxarrLwIIYwvte3rnBy4QbBm1Woj1IJ0Nn/Yozhs
            DmAYNlJaaK0JgpzR09vhh6FX7fv+jx0nzuaVK8UFX7hCnHXm6WTckHw+GvSbNxr1jQXLNLEtG0NI
            Fh67kDPe9jb5+OMPe/GEY2TT3V+zTJg0aYIwZZzSkloOF4WH998asmnwPMW2nUvFhJZaoQIbN2t9
            v6KiojST7fGxDOPCCz8RefAMg6KiFNCftlG4yKBDFI5/V1BoTNNEoYnHE1z62S8AebukyNG27b97
            +/bV87TKBb09npXPW0SRyP/4/Q57E6mqqqW4uJSSsqTd2dHhS5E4Tkr7R8XFSdZuWCt//PP/Eaec
            cDRuwEBRpsHw6lEtXubTWw9ebvxSCBrqavF8wU03/i2cNXWKdPN95ZWVNdcvX7lZbNm4BfAOK8vo
            sLcAy7ZZsWK5DHztxWIxhPS/U1Ia5+lnnvbOPuvt4qxz30ZUTEVRyOksqH/6RY6Z/4OhoLVGWPDO
            97wNAi17OtPE7fjZ27fvaJkxe1bYMmNGtJMexjQeNgGEQcjChcfKrB+Qdr0PZty+eZl8nw/K+sBH
            LyBVkogMPipEKf4P6a8ClABPBUyePpXLvvQluXz1ci9RXGb5Yfgp05S8sHFj5C3D5h9F5SE5aG1d
            dfSmENBpmiZKKYLQQ4Xw7nedh+HEyKK47bbbVtRV1k5f9dxi//0Xf8r68n99heKy4uhhVIA05IuM
            IsN1gZey+L0U2bzVtwD5oicTA/PQH6UkNKxYtoqTFx4TTJ85y+zr6e2xzPikD3/o43v/6yvfMMpK
            kqFh9BGEWSzLYjAx7Ny5/RD3f5WglBqIYZdS8tzi5ywpTe646563p0rLpvdlMgFCW6efcxrV5cXo
            /lg7482RC/dWAgU4gCFg5NgxnPned5srV67ynHiipC/d886iZIrZMxYKHcYRWDiOc+CfdX8izsvP
            +6Gxog9k9GitCcMoXduQFpbpsHzlylAIQbYvfYltWmxdu4L3f/KTjBw1slBKMarWEcn4L17fg+WB
            /9seXgwZDT15n9KSJGeffTZk00IrjWkY57muzwvP7wxidimu6x8IFAFeaQmaV7AsB5W/EQLDMLDM
            OJaZJOYU25+++LPqhptuOqa+tm4RSmuEZR53wvHU19UPu86bwa/31gNbgGVZmMD8+fPBdqxMNqMd
            x5n/859dPdM08uTcDiOesAnDwV7CV+ZCk4f+unAUiiaapg3aZseObtHZFYSBkjhO/OOOYfLC+g3h
            +z91ERW11YQqJKq5JQqHgXwFWuebo3TS6weH8nz6gGGAp6G2ppLPXHkFO59fExQVJcm7He/F2kPd
            iFD2pndjmFHEkFYCjY/G5VBEcIi5fjEVBX6A5+dZdMyRhmUR3nvvvVVSylP6unvQmV7RMnUKpeXl
            2Lb9b4XI1wuOPnohII1YLIZlGWft3bNVtLfv9Ht6+2S/lXVIJZJDwKFx1F8StSALSAPsmEdX30ah
            jTayXu8xQoiqjv1teuHxJ4vxkyZSUl6KY1tveQn9zQhTp05l9tHHiJWrVpFIpCY1jxhzjCDOtKmT
            zeLi4kKCqY4KYr1CjnsI6C+6FFFTPhfQuq9DrFi+TjmOQRB6J0lD0tvX688+Yp60HIdQ638J796b
            EcpKSzn++ONFprc3KCoqwbYTJwgS5DM2fT0hQ1F6aPS+Mp/MQHVsm7hTRVYaoqLGDC3Tjjmmc5xp
            G2CEonniaBJFcRCKYODiQ6P0DqX3vxTT+tclpoM/2fA4BArFzU0Lpk+fDn66/5s5KjDYsL3dt7Bk
            XaOloupjBxLbXw5euRYggmgbUMUQlgp0DDBbhDDH7+9oZ/y8OcaI8WPxggDbsqIU6zd6bv9FQDIo
            ZxGYNGkSyDhdXR3EYvbEUAXJ8aMm6UQiIV7U3OIVXPvlQZsHavNpB4LSAgGYgJoRj9m07d7tT58+
            XSaSSTzfIxaPo9CE/6fW/9PBFFBSUsLs+fPFnj178Hy30rT86pA9zD6iSQjpFuofG4WCmodrCBrQ
            BAo/lR4Ir4BaOScMNWY8oZqbmxFC4Pv+gEWqv9LFm6cy7lsfMnlFcXExY8aMEZ7nYRhWUTyRaDZM
            QVd3mzjQx+CV8d9XwCPyBfZvggjx9DZyapMOQw/bLB6XiKcIertkZWUlhpTYto3neQVTcSSHRodA
            DIqF+z8h8eXhpeZHSEglDSZOmiC8vBcWJSsIvdjYfCZGaVGz1srAiVm4Xt+g8vcvDS9PAIUEz0gN
            jES61rbtorKiWNm2GXfz/jjXdcG0ZXFx8Ytq2wxnQMNv9n87xKsHKaIw+traGoHWoRf6SGlMzmZ7
            WbFyqW7v2C+UCkgmHeQrWGEvTwAaIlnejNrqaIe40yTj8TpMO9ZgWrqura2NxjFjZHl5BaF65WJf
            f+bP4Ubt/juBFoAhCDSMHD0aCDENiR/2TEiW56isJ/R1PpIYpfGK2lq9QmdQf3kXxZQpU6TneUhD
            jnISCWvf3t3hhEktIp5MkXd9VOGSL5ezcCC5+//glcJA6lwhi6q6tgYQwg1CpGWMiSccO5fL4GcR
            YRDDMGKv6Lrm7NmzD/qFHmAfCiktcrk8Uhoo0UbjiBQ9XbkmIW1A6JHjx6MsCywD13XJ5PKUOTEM
            INARMejBgfVvEhhoFjMoaVMIiZTyQM3AYYR86DDvlweLCIEOkWXlUEleL9o2C3kUJTWVTDxirty/
            p4vK0srG3vT+Os8t2w4mYb6M0O/Csq0Xz7d++esPe1iBEAZ+4BOPx5CGoqe3TSA8/MCticViYEqs
            mIVhCjwvTxj65LM58n4wgPw3K/SnfIVhQFwKhJBorQoxD/o1aQSTC6L4vew/cO2oRkD03rAsGpub
            ZGdXh9Zap1QoGmwrRSpRJIIwIAg1rnvoHMKXJYBQKbQW2LaNr/JYjk2oLTOTDUCK3W6YBuHrfK4H
            7WUoSViUxE0cQ2EZUCQA0Z/ueWC3H+71eiOZggJM00IBtiExTbPQVCIc5l//50DCNKN7CsiHr/76
            gYqiKhzHoaVlkvDzHaGdCPACb7Rpucw+slEYiQ780EMYsUMWpTbq6+sP/o1gIOpHSlj23DK5Z/ce
            mprG+r29ualO3P5iOt07uq6pUWx8foNYt3oN2d40McPG68vh5XN4KiSVLIrQPrAFiCGC3xutDppE
            K2vJsuXs2Lmz8LyCWCxWGO6wKOTDHOzWHTvZu3cvdZWVeGFwyOye4bcLwkjwM6Rg+7at3HfXnUFl
            TZXh5t0VoQ4f87206QXZMJUqIpvNkEn3HvL5XxZC32XJcyvlpOkTlW2mcHP6C6ZhfS+ViJGMO2FP
            T5/R0dpJti3Hk3c+QSqVpLisjF3bNzFt3jzedd57eOf73kNldQWeF2DaB255qETP1wLCwqqThfx+
            Wxxggw8/9DBXf/ObtCxYwJe+9CUWLVo0xAQrDrKYDrWGHSBXkDH+539+yhNPPMk3v/nNKBU+VJhC
            EYQBUkocyyQIoxqKg++lh7ccIpIlamvrIYz6Grpe12RTWPR0mF53rzYam/rCWCwbTbAaPPChFztk
            PIBSAYCWyqSvL/dzPwi+V11TyfIlzwUrlj5nCMNiwqQW2lvbMLXB5HGTo2KKZow9+/bxlSu+xLy5
            89m4cfOQm4pBr68n+L6P1gpDgCMgV5iSObNmcvkVl7Ns0yZOOeUU3n/qqSxbtuxlkf+K7gf09fXx
            zne+g1/84hp++ctf0jJ+HIGGspiDEIKUY1NsmRE3CgJC3ydwfcJAoYbZ06WQhehqqKlrgEBZAotY
            LPGOVLL0B7U1zVZZSX3Y3DjdDLzkIXVsMXvOzOjdsL1CF4xAlqksIQy/qyu8rC/tfb+puSF4bvGz
            8uyzz5Qf/vhHmThtGqZjs2PDJv7wm99y7e9/w+jJUxg/Ywr3/O1vtBx5JGufe463n38+P/3pTzBt
            c0gRiNebABIFpHg6Ev46OjqjWMcgwLQs6mqqCTXs2b2bsvJykrH4yyL/UBzABr7/46v47le/xuK1
            axnd3EhOadLpNLZhku7tQ2iNbVnEYnGqiuL4RMWpcq6HOajEDDAQkGsagrbWblpGtTBu3ETt53PC
            sQ18N/OsKYpPynWn+rL5XqOjd2UI6Zcc8TACGJSkGPW1sXQY+N1d6ZGKovUl5VWxVcufCT93xReM
            K6+8EjsZI+t7GIaJicBAsHrlKorKSyltqGPJsmV84sMfobaqmrVLlnDz/fcx/6gF0fVfRwIYjL9N
            L2xi8+bNrFi+nC2bNvPQQw/Rt2s3GAbNEyYwYdIkps+awfEnnMCUlhbsuPOy11aHuG8YKHZs20Y8
            Hqexvo4nn3yaJ594gsefeIItW7bQunEjCEnD+HHMmjWbY485hilTpzJj+nTsmImnhlVMUWpALmvd
            28nZJ51DZ1snFWWlWmg/bxpBXOiip3dtEkeXlBSFezqeEtCtX2rEor65dpCxRxIGhXra0qOpqdFa
            MO8o/+677v92qrTiyhVLl/pnve/d1jW/+w2pmEVXJs/9t9/J/ffdR3l1Feecey6L5s8hALpQCCT3
            3nEnHzv7HNCar/38Z1z4yf94TQkgCAJs00QCntIYCNK9vSx9bgl33XEH//vr30AQgDAgDKmva6C0
            qBg3l0eh2bp9S1QVVGvOOPccPvW5zzBn/hxcP8C2zFdce0gO+oEtoaerjyu+eDl/+98/RYKl0iRT
            SexkgmRxip3rN0TBf1pDmOeSL32Ny774BeLFySFe1X41UErIZVwu+th/cPffbmL81Kl0tnVgmTpX
            XVEXz2f5ZiqV+EpFhWO27t8ZCKHxg8hR12+yV6HqFwL7GzqYxGIW6Uw3ne37DQP8TcVbTCntMwEw
            JR/48PlI26LT9/nRT67ip1+6EpKloEKu+cEPeed57+db3/0ORXWV5FCMGj0aHAc8F0O+9p1qi0yT
            rI6MLQaCv/35L/zo+z9gx8ZNkHfBkCBN5s4/AlsY9LV3YigQls2WXduZMXM2TjLOylWruPOG67jz
            huv4ywP3c/wJx/1D49FKs23nbj7x0Y+x5MEHmDF3AcoLkBoSRUl68lk8rbjqN7/B933uuON2Hn3o
            YX76ne8gDMmX/+urQ64nCrYArcGyTOYdMZe7b7kZP/QZNXoEfT1dtudncYPMB2O65Bs7dmS8Hbu2
            i5Ejm3QsFovqDIaKUIWRljcQ918o5uzmfUzD4KijFgqQ7Nq1q8VxnJbW1lYmTpkqZ82ahZDwi2t+
            wU+/9Q1mnXY65LPg+cyev4Cb//RXzj7tdLpzGRJIpk6exPX33sOPrr2W97znPa85AXhEkn0mk+ZL
            V17JZz7yMXas3wD5PmYes5D//N53uf/Jx/jWj3/Ak08+Rihhb08nsZoyPvuVKwlNwbNPPMZHL/0U
            777ok4DivHPPZfPmLWRfRT5+P2fI5bJceeWVLFmyhLLmkeQ8Fy1gxaqlHHfySZxwwolsXL2aBQsW
            cP75H+Laa6/lkccf5wtf/y8a+ruaHIywNNiWEZmEw4BY3Gbu3NmMGTPG2LRpE+VlZfXd3d2jhBTM
            nTPHAMhmslFzCq0G1FvzQARJFMRtWpowtBC6CMuoJAzNiYmEI/fu2hqeetaZsryslA2bt/DwQw/z
            25tuxjYtej/6UXZu2cZ3vvRl5s6dx+Kli/nlz37OpZddRhGC4485GgfI8Nr7AASRgKeU5vfXXAPA
            sSefzEWfvIjps2ZSVl2JbQp2d3bSPH0K+WxA88gRdGXS9GUyVNZUg+NwzjnnMGnaFE485WRuvPFG
            LNMimYi9qvEr4LmlS7j3+us57txzGdHYxB/+52fMnr+AcVOn8cBDD2E5NsQc+vr6sBwTy0kxe9ZU
            JrRMQryE9NnPBZSGktIS0JpcLofneZSWluJ7nnY911IqbIjH48/ncjkhMJDGi+0aZhT06RV8x1Fd
            G6FSLHt2H0WJKqTqqSspNQFLTZ8+zbAMWLJ4CZd8+tOMGjmSdHcPTQ0NtEydSnVDHZ97/weYOGMu
            V//nNzn9pFOZPn0qEujvltdfqfu1Ev4EUSBKdXERz61YyfatW5k9YyaJRIJYzCSvomYSpeXl/Oiq
            q3jn8aeSq6ympKiYX3z/xwRSM2/hQsaOGEVcG7z9rLN429lnveT9hqPoQEHKCCZOnsyl3/w6F5z/
            YeKmxeqVq1j6+OMHsOjYfOXrX2d8yyQMUdBONJhOIfFXRzcZiKzsrxJbqJjV3NwMKkdfXx99fX0E
            nodhmloiRCqeTALkcm5UuFeYDNcLzaHDVoCJVgLCYk1YDDpXOXBvAVlPUVVVhZNIkM5kCJQinc1i
            JWJ0dHVhFpdTVlICfsCzTzzJ9OlTXyNUvzQoFZLFYOyoZhqaGjHMCE0uBeHJ95GmyVFHHcVNf7+F
            q777A5594ikClefYM8/guz/6IZWVJXhB1Bt8cPuYVxvWVFtdxeVXXI4EfD/g+ltu4vFHHuXZ556j
            vKyMaTNncMyiRVimIKOi8Q0uBK8PsVKKi4shVgIQVRYPFclEAj8MUSoUQ/oRyRcbBUwpCjE7A3aA
            F3mRB/UwiZINyitK8ZQm77kki1P09PSQ6czxrSu+xMiqBnZu3gp+wNjx4yPKeT2RDwWnjiajQZkC
            i/7uXxoLgWWZBJ6HZTucctqJHHnkUWzavhUtoLa+nvLKUrJAbz5NKh4ZUwZYZ/8KlEM+viSkfQ/L
            iNZZzDLRiRhnnXsm5557Jm6giZmCAMiGCsOQQ1zlB3ObD6eHyspK5h97LM/cewc7S0oxpEWqpJgg
            8NFKuxHy9UGRD2AKIQo97PpPFdLAZBakDSjV37NXCzAtEyNmk+9LIx2brnQfiUSCjZvWQjqLrtTM
            mzOXX//1WqbNO7ir+bUCrSEUYBgSszBZ6TAgb5gINBII0JgIHNshDBWekNhFcWZOn4wLeIHGCzXS
            EJSmUv0zMrAsXo6YB6/c/pqGScvGB1QYRAlyloVf+N4wxUCpHMt49UWztICMmyeWiIMRx5CSzs5O
            ksmU9D1fCW3sEzqJEEpFNs/+SiIH2JgphMHgUGIhbBzHIONtEU3Nk3Cz2f1hGAN8kcmmyWuf4qoy
            9mXTSMCxbHw3IN3TiywpYfuunVx06SXMmDlzyGwN6P2voeVnoO3LoEe1DUlUVTeqsukX6vL5aKQU
            hZp+0Ne/ss0obrF/Rvr17oN1GBk6lS9uNwP96igIw4wQX/jOG/bTg+0yioPsOINa3SgB2rYorYk6
            symtcRxHB4EShoilQ1+27tyaQZqh1sZ+tMhECb7yAFOXQkiEkAipEFJhmoIw9DjqyCMJw5B4LL4t
            DEIwLLl27WoNCtOx8VWIUiE6VJhSUl1djerrpa6hngcfeBClFOEbEOw1GDEaBYHCVyF5rXDV0O1N
            iQPHkPMHuW6/7v2KxqAPEEP/pYe7Y4YLi/8IaKCrt4vmUU0QBpjCwrZtFegAYYU7xk8ct88PBdmM
            q1SokBLC0Mfz8kR9izxkf7NCISMhQciQZLKU5Yt3orxKLKfoeT9w/camEcYjjzymWve2UppMURxL
            RA3bw8iwUF5fw+SFR1JZVMLD99zHvfffR4ljve6hX4Mjji0klmliSQMhNIaMzNVDkVGoTSBVdDCs
            bpk4uCB20KxeMew4yJgOFiI/vKrpAPfhZe5bGFNvbzfNzSPAsAn8EGkQmpZPoNsfLauCEaPLrKJi
            R2tCpJAYhoFhiugwjP4AvgM06fsB6b4+ksmYtm0JqE1aio21NbW0btmudmzaTqmIUVdeiYNEqBDX
            y2HHHD744fPZumkLIgx54IEHyL7OyO+HfnujBh66/wF+evVPuP3mWw+UXOHAKj1YvsKQ0PVCVNPw
            3x/sGA4H+80/Oyze9wNSiQTJkjJc18VzA8Oxk7j58Paenm62bd+g8m4noAYtcj3QpdQcLhzGYkVk
            gpDS6mxYXpE1j5y/wPv7HbffLixzMqHmN7/8DfPmL2BKfSN+NktHZwepZAppGVRV1aA1NDeNYv2G
            Deze10p9bc3ruhH0r6KedC9f/OznufUv10E2w5zjj2P3tu3MmD2XhoZ6KsorSBYXDfB1o7+EjTwg
            wEFkVeyP4Gnv6uWF519g67atqFDR1t5GWVkZkydPpqWlBc/zonCyQszBpk2b6Onppr29A9d1SSQT
            VFZXMWbMGKqrq9FaY1k2+XyeZDJOPu8Sizns3LmLVatWc+xxi0gm40OeLQmkNQRasXvvPsJAkkqW
            MnHiBDZteMFvGjHS2t/WtUvquicMXYVSvhKGjykL1V36xVkd+R3MIU0dkajARIoQRS8ZH6Gkh2EY
            v8pn3M/Mnn+sc+cNt6kbTrpefuDD5zGysakQBOqS73G54a9/o6GpmSDwkUIQj8d5vSFQGiEFjz76
            KLf+6U+MHD2e8tJSljz2OEseeoR+GX32ouOZNWsWRUUpioqKKCsrJ1GUpL6uEdu2cV0X07LwPI/d
            u3bR2d7Bddddx5qnnwTDhNADwwHLgiDgQxdeyPPr1rNr1y6EKdm1cRPEY5DLR10hpIRYLCI41+V9
            H/sYc+bOpXXfPrq6uujq7qars5P29nZs22bxA/fz1auu4pJLLx6yHWSI4hhcP6CnuwetNbZtU1xc
            TOD7+L6PaTp/nDBmaubxxx83pOmHlh3ldSpF1E9b9Iu5EjF61Fj6GZTAQEiNxifExzQFqXiJdewx
            J/h/v/3e7xhm/PJ4KuGu2bDK+dPf/sjZZ53Ffj/Pjh272L9jL+895bTIkQ385I+/5tz3vgvbPiBx
            vh7yQBgqbEOyat0abrrueopNh+9989v8+OofMWniJJYtW8EzzzzDPffcg5dORwjUKrKrah0hN/DB
            cqJXKSLkKUXdyFFk3Tw9+/ZBWLDahB5T585n9eIlCMumorycQCvKy8oor6pk5erV+LkMBCE4DtNn
            zMR1XTasWQtePjIoOA4ojeU4zJ4zm6qqKnbt2c3OfXtZv3H9EMuMFwTETJPdbW1s2bYdYdoYvuLa
            n16jbr3+RjF63FihtT553Pgx93d17DPXrn0qEFoRJfMCIg8oBHHQZoEDIBEFe4/WAYjI7JfNhGzd
            uCk47tgzeMc73nbFDdfftMC2rWOmTpqa+8DZ58S/cfVPeO9HL2DOmLFkGkfz0JNP8dtf/4Yzzzmb
            0844kUMnJv3zQYgocWLW5CmM/Fwjy558Bnwfy7RYdMwxnHjcMXjuJWQzWdra2kApMpkMXV3d9GXS
            SNOio7uL3/3ud3R2dFBRWYk0TR5//DH2btnCu87/EIsWLaKpvoHq6mqWLVnKRZ/4BLPmHUFvVxeW
            ZeO5Lmhoa93PRRddxKixY3Ach9a9e7nzttvZt2s3U6ZMwTajOU/E46TTaeKJBD/+4Y+wTIvZs2bw
            iUs//SJd0DBMXK3p6OpE6RChAuK2Q1GqRAReoAkD0d3XURSENdixqBWH1oNbaw6VWswtW7cM+mKw
            SRggxsTR8/Wf/nibUd1ohaXlsXO9fPBI6NnT5sw70f3KZV81n3jkGeMjH7uApqYmRo4ZzZf/62vU
            1FWQ8aJuWZZVkDOJauK9mCCGikKvVl4YLkj1t1/PC01RcTHFpSVgSm69/TY+fMGHcZDEHUHcTFJR
            nhz4vyAPfhjSk83y61//mm1bt1HfUM8TD90LmHz1G99k0QknMKllMoZpUJKw2Nfei/v006BCXNcl
            VUiPi6eSpJJJ1r7wPOlMmjFjxrBl4yaWLVuG5/nU1dai/RA3myXdm2Z3Pkd5ZSUrVq7kez/4AcKI
            lNgzzzwTU0I6HQnZSVPiC9jf00tfOo0TTxC4IfmMS09fGmQUwp9KxJTWHrlsjt4uvzCpfcP6L7kR
            ARyYuoPXmzVtSWVleVhdY5ibNq/rErpoQXGR+dfujr6z50yby+P3PxLe+/fbDFQfFFVw6lln8sMf
            /YjamnKy/huT/yMKnpJ+0y5hyIMPPMDmzZuZNmEcfk5jWQI80CEIG8wYPPfkco5adBxoxdHHH8/j
            jz7KBZ/8NBdddBFjx47FtqO2s73pHNdefzsfO//DgGDmwqNYvmRp1AI+2xtZUFXIqEkt/PYnP+K3
            P/0f0C4yUUppaRk9Pd2E2RwgaBwxgtLKCqxEjCkzpnHr7behshnmH3Ms48eMJd2TIR6Po3QUypbX
            mm07diBNAykNIEQaknSmW9uOIYqKikine9MqdLCt4gEdVhZScw8UpoxwY7z8ugtIFRk4CY+s266q
            a8rNQGVdLbzrVKiynhcsrK6ptpvHjA7NZLGsqa/j2Uce5sQzzqBpRCPSOLA+X7qf3+EpQy/53yJi
            e8lYnP0dnax85kmaRoxkxrTZOLYZJawYB+SzO+96gBNPWsTsIxZgxB3WrF7JT3/7ay76zCWUlpeB
            FISh5vkNz3PZ5y/jh9/+b+YdeRQZN8+2TRs55pSTec8H38+Fn/kMp551FlNnzeK+++9j4uSpJIqK
            qGloJh6PM2rsaBYeeyxzjz6KxjGj6Mz0smntGlp3b6O8toHmxkaam0bw7BNPUFFeyUknHUvcEPTk
            XWK2ydZdu2jv7MC0TISITMjpni7+fsPflA48qQOtVWj/uKpyzD4vJ+TOnZtV1JlpeOuaCBOHCAtX
            mI5HNpfGsCWdnX5QXJwyFz+3Lpw8Ycb33Xz4167u7vtkNj0pkYr70rSsd19wAWWlpVFaGG98TQDb
            sjnnnHO59le/5uc//zmLn1rMwiOPJBVPsOCI+UyYPImHH36Sc9/+NuYfs4hnFi/h2JNP5M8330DL
            5In0ZfNgGPT19fLko49xwQc+iGPZTJ0+g+ceeZj3feITfPTCj9M0ciQV5SUDfgMDKCoq4kuf/Tzz
            FxzF8hXL+eD5H+LkM06jtKoSYZl09/USotm3ew/Llyzljz++CgLFpNlzmDp7Fv/11S8zcWoL55x9
            KqlkjO5cno2bNlFdX0sml0MoRXEyTnvHfrZs3aSbqhoRythiW8nN+WyedevWaTiw+g8G8lBGDSkk
            th1DkEAFMTraegMdIsJQxkzT2WXb9q9SqRSbN2+lOFmkz//gh5HS5IWtOwZWaKgjtyqFmoGvZYUA
            IfrjDfp79UjmzpnH6eeey/797YwaNZJ5847ADwL+8+v/xTvf9R5OP/MsZh9xBM88/TTv/dAH+OOf
            /8S4CRPIK00yEaO7r5fvfPc7XPDe9zJjxkzcTIY1a9Zw3a238cMf/pDpM6ZTUlqCCeRDzf797Sxe
            spydO3aCNAjCgHHjxrFhwwauvvonPP3002BIEsVFVDXWMWZ6C6e/5+386aH7OOlD72P9upUYqQSp
            uhqu+tnP2N8bdR/csmUbZaXl5HNR7IYm8nyuXLkSv7tPJxNloM3n6huq+x57/FbZ1X1g9R8E9RFp
            yJdYo6rwd+LESE3sDx8MVRohDBrrx5qdnZkgnc01e0GwOpFKFr+wZVP47R9835i3YD49fd1UVFcx
            afyYKEdQRdanQ2QqHbYQOPhKEnC0wBFw15338s4zz2TCxBaeffppSkrj7NzRyohRoznu5JN46J67
            ufCLl3HlV7+CYZuIQpz+2tVr+fhHPsqWFSuZvfBolj7yKB/8+Mf5whe+yLhxzbhh5EwNNKxau5Y7
            77iDv/71OvauXw9OnFmzZrF9yzY6OzvQuSw4MZBwyRVfpHnkSHKBR2lZKTU1tZSVlmKbFvffcy/f
            uvxymiZMZOfKVdzyyGM0jxzBpu1biRWnInOxAIRi97YtXPKu9+lR46bpmDCkCsJ3NY+ov3HX3q12
            fW2N9+B9D2IUdnp9kNk1xIss0YP72gkqK6uIOnVF3W61DghCn3w+o1JFcfOkk0/rev75jc1OPDa3
            q6cnbO/sMBYevZCi4iL2tu6jo6eHZCJJadxBvWSHsBenir1S/nCoFnJBPsCQBslEkp//4hq62jvI
            53JUV9fx61//mmWrVrNx40bOes+7+NFPrkbaJsIwEALuvese3n70IkY0j6K8poZVSxbz6+v+yhWX
            fw4rmUQj8VyPPdt3c/WPfsxFHzqfp594AmEYeAXH095N6xk5pYUzzjyLorJydu7YwbSp07j9bzfx
            8J338NDtd7P00SdZ+8wSlj/5LN2tbcycMo1R48azfOkycgieW7yYWbNn09jcRNbND/gBJJonHn2Y
            ZU8+qhpG1Bj5bOdz1VVFn5PSY/GzS/TYcaP11s3bXr5t3SFnuH/J9led1JJ4PInr5rBtSSrl4MSM
            72fS6fOnTZmSWP7wY+rJx56SJ5x4HKXJIiSCrVu20FNRRlN9w0B0zusF0jAwDKipq+W3v/8dF3zw
            fG6/8w6uvvpqlHapaRpDvrOdb/73tzFsiQo1hoA77rmHj513HkefdAqPP/wIDaNGcOt997HgqCNJ
            ewrDMAhDxQP33scHzns/OgyYPGsW6xY/S9/evVzw6U9zxJELmDhxAg0NDZQWF9PX2cMl/3ERD957
            H0cecQQrlq0g6/axf89u9u/ZC1Jw3523A4KPX3Ixk8eNZ5u1k80rVrFsyVJSZSUgDngaDS3ZsHo9
            KKlDT5Huc6+ON5Wyc+d2+6TTjvcGx2Drl+CtByGAoarbhufXHVhOw2Drpp1B1vUsIf2t0jD+q7Ot
            87uTZswNvvef37LH1Dcxadpk9vd2YCfj7Ni+i2xfluYRzZjCiErJSgb0kJeKrXtp7eFQUFB/TIEb
            QswUVDU2QuBSWlXN7LJKtNYsWfwMDz3zDLV1dYSewrYl9z34MB876xwmzl/A4/ffwYc+cTFXfO0r
            lNdW093bS3VpMe2tHVz9gx/xP1f9hONOOJ6HH32EdcuW8e2f/4I58+YybfaMIRPsAO2uS09PN048
            xgvbt3HeJy4gVVTE/o52du3ZQ2d7O2ueWUJZdTU3Xn8TKTtGY209+cpannz0MY5adAzJ0lI6OjqI
            2w57tu/k8RvvYOzkuaZyNQm7YdXzq9P09ukwZBeoLAg9JK5h+DwbL8UcXjThA5gY5NMSmr179+jG
            xhp8z38y9NW5MTPZ0NXe6W7ZtM5cePQCisvKyPsuTixGX28vPT09xByHRCIRtZAZHmhRKCbxShF+
            qC3Ay7nEHJMXNm9j0cypNE+aiu962LbN0uXL+NEvfsaZ55yGUpDJZdmxaxenz53NkWeexfKnnub9
            H/4Y3/r2tykqKwVTkIg5rFyzjve96z3cc9N1HLkoshe8873v4Zd/+D0nnXoKDY11CCK9vSPdF3VB
            x+BX1/ySP//611Q2NTB6ykQ+evFFTJkzk0kzpzFrwREcs+hYps+dx/MvbGTPzp2MaBpBuqubmpoa
            nnrsAeYsPJpRo0bR1d1FbWUVd95yO8ufXuqPHDHOyKQzTwrM70gcEsmY7su2I4Sitzs9JI5h+Hy9
            egIYfAmhGTtpJKVlSbMv06VSqeTSzraeT9TX15sbN68KlAzktNmzCUKFDhWO42DbNt093XR1d2PF
            YpE+Kw/sUv2+938WAcQsk+7OXj7zqUvY8vwmxowdhw5CVq9by8lnnsYVX7qSWMwmnXeRUvKFyy5j
            0wsb6epLc/wJJ/Ltb3+bovJSpCXRAp57bgmnHrWQorIymseMZ/nyFfz0mp9z0acvobahHsOSBAo8
            pQh1SDwWJ5fLcdPfrucrn/0cc45bxPOrV/DhL36WipENdGfTeCpEmAam41BTV8/xp5xEWV0Nd//t
            L9Q0NWPZNnva2qmqq2PM6DEUJ5JsWLuOb3z+izSNGqd9LystS17qBT0bRo4uMtOZvUoLIDTp6+19
            2fk6bAJoHtmAUlo5ZsoKfWOXm/dbtQ7PHDGySd1/xx2iqKxCTJ06DcdxSGfSCNNAG4Kc67KvdR+x
            eIx4LI6QL24J+88ggHzO5aof/5i//PLnLDz2BDZt3EhTUxM7dmzl6l9ew7jxo8l5Cidm8ctf/orf
            XHUVLUccwe7167n17rupqalBGJH0umTxUs485hgmzplLT08Pec/lpr/fwmmnnYRhO4QUqooUkjct
            KWlra+eXP/0Z3/jMZ5i3cBGLH3+Md/7HxznxrNPJBV6kHWlQWhGGIVYsRqIoxfjJk5g2fz433ngj
            ru9TWllBR2cHxx2zCC/vctUPfkhnb6/bUFdv6zB4wvX6Lo/FNMuWLdVV1Ul0EIW+9HR3vbYEUFtf
            QeAarFq2Swe5hFHfULo48DPVUqeOaB45yb/99juM6uoaxk+YiJAGwhAEQhMaggBNujdNd3cPCEk8
            nsApFEEK+qtzDAvGGxyxM1xTGBx0oQqBHI898Ahf+OTFLDzuJJ547HHGjhnHkuee5Ix3v5eLP3Mx
            fdk8TtzimWef48IPvJ8jTzmFZY88zC2PPMyEceMRhqBEwvbde1k4dRpjpk1n4+pVNI4exXU33sDE
            yROjiGMJhhQ4hsAstHHaunkb3/h/X+Vvf7yWGdNn88K6dTSNGkVPTw8JJ0ZtZRW1FZUEfoBjWUjD
            QAiJpwICraiqrqZl2gxu/8OvqGoeg5vOU5RMcd/d9/DY/ff7kye32F42B9p/j+9370ombasomQp1
            KMAIkYamu7N7yCwN1/kOmwAaGmvxPaguH8eO3VtFZUWJNi3jrjAwZrp5v6Wxoda99dZbTMuyGTdx
            PFYyRnc2jY8iVVKMlBLX8+jo6qS9q4ueXA7HiZOyLULx8lxhcJhV/28CPwANtiHo7urh4x+8AEOa
            7N+7j4997ONk3Bxbd+7iN3/6I3U1lWghCYKAb3/7v9nb0c6mNWv45lVXc84550T5c6Zk255Wzv/g
            h9i3Zx++6zFp2jT+8L//y6hRI4akuiPAy/tYhsGDDzzCifPms2HlMkaOHseaDetYdPKJLH7yCdq6
            unjytlt4/vktaD+gubGJklQRhhCEKjJh9xeDqm9opH7MBO669s/U1Tdy1y1/Z/PzL6jJ06aZ6d4+
            bMu6OJ/L3DJ2fJO5e/euwJQxQKILpXm6O3tflk8eNgGUlpURhgHS9KitrdLbtrYapSWVev2GJX+r
            qCxamM9lx40bO8697dZbjVhRSoybPIFUWSmBjKTTA5G0grzr4noevX195EOfeDL54hItByGAwXaE
            mCHJ5vJI2+LvN97M9b//E9nuXi68+FOc8+538J9XfI6f/OEPnHzisfRlfZIxkyXLVvCVy79IdV0d
            E1qmcMUVl1NZlMRHkPd9rv7J1dz+x2uZNW8e2zes5ubb7qRxzEhCQw7RViRgSYOf/c/P+eRHPsrY
            lsk0jxlHRy7Nld/7Jqe/9x0ka6tYfs891DaPIyVt/v7XP7F3XxvNdfWUFhdjDJbTBSAkTc1NlJdW
            cM9NNzG9ZZouSqZkX19vzrHil4jQ/MW+fXsNz0+HQkiksEAbaBGlFA3nAP90Ahg5chR+4JFIAlJR
            WlKlE/Eiq7g0EYZh/n8lzPO8YFJ9Y5N/7y1/Fzv3tYqRI5qoqqzCzeUIfJ9QgDQNhIwELYWmJ91L
            Z2H/UkLjWPYrIoAw1KQci86Obr7+5a/iSJuOrg6+/YPv0TJjOvNPPJGTTjkZ14u8aMKQ3HrrrTx6
            9930dnbxvR//iJnTp+IW8vLvvecevvrZzzNn4dEsffwRHlm8jCnTp+ChKJZyoMxbPwF86fIr+fH3
            f8j06dMJXI91S5/l7He+i+PPPp3QEEycNJHjTjuDIO/yyH33MWZiCytXrGD18hXMmD6d4vJylCxk
            jgnoSWdIxhNUlJXxyMOP6Xg8pkzDkJ7rnrfomOOv7ejotdrbOsLSsjimCTo0Cxwginzq7uzh5cAY
            viccWggb+qtUUSmgcb0MfpAlm+vDD/KqoW6UmU67ynbUX9x8tinT684dNXoiix99Ilzy5NNyQnMT
            Y5qaCS0DaTsYpgWyUKatkEAYhIr29jZ6e3rI5jOEoR8FdBkSW0gsCjH39PsbFF7eJ2GbrF6yih/8
            9/foSPdwznnv4b0fej92wmLEyGYMU2JaBoYpcX2fIPC5/s/X8tHPXsr73/9+TNtGCuju7uKrV1yB
            Zduse+5Zfnv99Sw8/jh8ARiSPFHalB8GGELyw+9+j59969tMnzOXlcuW4Vg2tZW1PPbAgxgxh8mT
            WxChorqulubJ45k0fw5/v/lmRo8cw55tu9i+ZRsTpk8hWVZMNp8nVZTCkFHFslRpMcVlxeKO224L
            KmtrDVPLzqOOOPrOW2+6Wzi2o/JuF56bI53JkctlyWczUbm+vPvyBMBhgaSisrqQ8RkRh2Ea+L5P
            Jp1Xu3ftNUqKSnQY6NvsWDxM9/UeP2bkKJnr6/Nu/Ot1sqy0XFTVNxBLJPByeXzfQ8oogSPsz8RS
            AVpr3FyOXD7H/tY2XNdFmwbSNDFl1IpKCrCkQBomoad46I67ufeOWyDmcMkXPs+MGVPxFQP1c/s5
            iWFImkc084lLLuGYY46hIpUiQJPJZPE9jy99/jK697Vy2de+xqUXXRjVFOo3gxRWfRiGPHDv/Vx+
            4YWMnzOXdc88wzd++APOOvNMbrjub7S0TOH+u+9i9LixjBo1iu50H1ZZETWNdRx55EKuu+ZXjBs7
            ng3r11NWV8O0mTMJdCTuCiEIggBhmhiWyZPPPIuphcTzR65avvJXruvmMrkeYZg+Ch8xxLYnONBH
            6DUhAEFFZVU0DdoAHTWKMAwT24FUskjv2+Ua+/f3itqa4kc9v2dpuq/vlMrKyqK62obg1ptu1atX
            rZITx46joqSUitIycl4+2gZkxAJNITAjrxVKawwZVSPt7Oykq6OT9vYOstkcwjQwLBtLQqY3w59/
            /0dWr9sA+Rxf/9EPSBWnsMRQn0P/uxCNKQ0cx4kETx118I7FYsyZN5dJ06Zy6Wc/gy8kWhywWRgF
            TWPLxk2ce9QCJi04iueXLePCy7/ISaeeTEVVFSNHjeSvf/wN849exHX/ey2zjjmKupHNUQh3Nk99
            dS1HH7OIP/7yV0yZPp17b7mZo08+idLS0uh5DYNcLodpmdTX1tHV1iGffuDhYHTjiJSX7Xk6k9/3
            /OSpzVY226f0gBGlv0y3JO/meTmefpgEoKmorIymU0dJplKaCKEIVQ7bNilKVui29jZGjKi2EP4G
            J2b9PgiCabmcN37UqLFy/7697o1/+KPpBQHV1dWkUsnIGCQj17EJSBmVngdQoSYMA8IgQIUhgeeR
            Safp6O6idX8roa/Zs3MXv/zpz+lq28c7PvZR3vf+90QxnIPFl8KrHwZY0hjobCpFFBcuhURIwZjR
            YzjqyCOJmSauVlEWVWF6DQ1B3uVvf/oLjz32OJ5SLDzpRD78kQsI0OQDj6q6WtxQ89Qjj1FZWc2K
            59dx9HHHYjs2UgvwQyrLK7Adh3tvvQGkyZSZMxk/cQI5Nx95/pRCmgaOZRN6AQ/feXc4oqHJyGWy
            ez3fv8+0TbMv3RMGvo+U/e3kBQhFPv/y2RmH7ZmRKKRWSC2R2iy8SgyhCYNetLGbiS0lOp3t9AFb
            GkGb5/eeGovLizPprt7q4lJnyuSp6uY//DH4yNvfqe+97S6693XgKEHcsDClRAhBJp1BSolhm5iO
            jWFZhbq+BmYh+1Ypxf79+1mzeg3bt2+LSsHMm4sfRnV68l44kFkTFg7DMAgLsYpaiIH3g8/5RKmV
            pmFgyoLm4gXEDGjdsYtvXnElE6dMI5fN8qlPfQrDtpC2RTYMiFeUcNI5Z2JZFg11dWx55jk2rF6L
            JSMOowRgGUyfNxusOIQ+W9a/QJBzsaSJwYGilblclrraGlC+CAIPQyZHh7laOnbHwlyfwjKMA2lp
            Mv9P6BfwiqC/P92gjLfBFcalNxCKDHiVlZXm1m1bhWmpn2mVm6wC/1qpkXPmzDcnTZqif/H1b/sX
            f+Tj6oY//ondG7cgNcTjccorylFKDRQ4Mi0zylQepuIIIchkM1FBSKWjpBVZCK41Xj3DG56yZRHF
            NsQsExHArTfcBEg2rFrFhz90PtIycFWAqwO0bdDn5Rk/eSKf+synWfLUY9Q0j2L5U8+S7omigSho
            PmbMIVZVAVjke/oIXQ+jkLIHUZ8AAK0VpXV1orOzE8eJ14AJ2gzRr6Q7wD+bAAq1BEH1t5JhII5Z
            xUClIEyBStC/J/V05wIVIqTEUiLYfdbbz/6QEhy/b9/eZ/KZrGwePdYqkjZ/+dFP3Ive90H9u1/+
            msXPLWb//v3E43FMw8SQxgAxROlOB57dNE16enrQKgqJLiktwhCRlnAA/4fWd4bn6Q0+b1kCacCm
            Fzbz9a99lSPnLyCeTGHbdpRU4nvkfA/Tscn7Hj3ZDKNbJkIsSdCbYf3i5eT60qgwBEMSSLCTCWrr
            6zEdh872dlzXxTBe7Ky17Sj3IJvNYVpBArMdZbWjpTc0ybVQ82lIE8khCzU6/onO+eGdKgtcQEfJ
            2f205rkBkydPUb193f7mLRvlQ48+ZJ56+qkPv+tdb1tgGuqdFvqpimSxnDR5mjNx/CRu/cOfva+8
            /8P6qm/9kLtuvIOdL2wl295DUhg4Miq3plWEKiUUWmrSuTSQB1ziyYh9Huhm8uocy8MZqBto4kTR
            xP2VRA0Eub40mUwGaZporfGDAKTAKGxblY31fPoLn6djfysTJ04c6KvUb+hyHIfysjJM26a7txfX
            j9ruaKWjyl46es54PIE0DGFZJkq5INNRLQehDlIY+p/VN/ClQMOGDZuGnIo6VTFs0gdP42CzDWrT
            pk0qn89b7R37fOAmtH1TMiHOVcq8VIf+ogljJ9imYbN16aZgxX3PYjiOPPucU8X8I2eIkWNGUl09
            gqwKCIQfxcUbCu2EkAwgBMOCEFUoAy8wX2GpupdK3zYMgQf4eZ/rr/tb1BdZGqB8DCOSVyzbJufm
            omwfwyQMFULAieeeSeOYUaRKihFWVMswnc1SmSohZTkYGuxknOKqChTQm+7DiccOjEiA6+XYs2eX
            rrDimJbRVVVVxbad20RVVbUWQmDbsSFP0N3dfvAH+acQwMtO3Uvddei54pIE2VyPv79tj5g0aaLV
            uq/DS2f0rcWp6lsDz1+gg8wF2sy9fVRDXYXZPIpdu3Zxy3XXB3fccp1SaHnyaecYYyZNECMnj6ao
            vJiRI8ai/DByxvvQ1dU+kKwp/rFtcgj4XoA0TNatWctD9z/AvDlHsL+9DeHEaW/vIJ/PY8UdYipA
            hyoiEAGGaaCBSbNnoLXCC4IoLsEwI4ukhrVr15LtaCcwBfHiFLGiFK7vgY4iepSOah1nurv12HG1
            5HK5nb7vM23aDHPXrh1+MhkbWsPgFfQOfg0I4NWBUi7ZXEjziEbd0bnf6+xuk7NnLpQ7t/iB5wdP
            F5VnnzYMdWVfJntONhO+s6Ss/PjmEUc4bi6DloKnHn5c3X3nPR7aFzKZME85+Qy5v3UHo0c1sGX9
            btpa9yGkRqkQm9gr6qMzGIYz0VAplNAsXb6MQCsy+SwYEsdxaG9vJ9uXpjQZJ+HE8cIo2UYrTYhG
            CoHrulFatm3iSAfLsMj2ZUiVlXDBJy/kZ1//Ome+7RxSJcV09vYMbBX9kMmkIZ/V8UScrnSm247H
            kKZJqriIXD6PY1ov/TAHof83nACCMMpuDXwfIQyqq2rUvr2tqr0jEMmkIxsb60Vbx/aOQPm/K68o
            +V1fb/ckKTlFKHGy53nzG+pqy0bZtqOlIPQFD9xyX1hS5Kj6hhITdovurt6BvdQ0eNUEMByScZt0
            T4b7778f0zDwwxBANzU1iSfvuZ2PXvxJyoTAsiwC98DdBiqGFCT7qCtJVIIsRKGk4PhTT+Ko444h
            FovjBT62bQ+kuvVDb28vmFFrPqA7l8tRXFqK6w42+R6kc/hLML/XNEJTHLIgkMQQNqEv0cpAEhWo
            DAJBVa2lE8VeuG9va/D8mp0ym8k56zesk4al1ufd3qtyfuZ0jT8FEZyTTXf+MN2x/2ny+Z6pYyYZ
            jRWjLPwSkSiq0k88/iyZdBrTssi+RPrbqwET2Lp1G3fdfAMtLS3ajxAhKisrQTp69ZrV5HI58vk8
            QRAeQHphLgxDRiqdiio9+mGAYVlkQg9lm1hFSQJT4AUHxppIJAa6lwRBCGGIZVkkEvG9juMM9BsI
            Qw+lA9RA25tBRFBQa+Tw47UkgFcGg1NRBrtCow6YWgsmtkxUqaIiV2t0RUWF1djYbIW+gWmW7ikq
            rrutvm7cZY11TUcqNzs53d1+XCab/rLG7G1oGiMev+d+tX3HDizMoa5W/rG0lFwIDz/8MBi2FkII
            pbXO5XLtO7bvUHVjx4o//P4PuK5LSUnJi9j3kKcWYkC3VwJCCX7hCAfVLVJKRWqtjkLqtm3dCiC0
            0rS1te+QUuJ7eWzHJB5P/EOz/waD4kC70+BAp9IwBSpFGEIYekihaWlp0bt3dvh7dvb4u3fk5K4d
            vvHsszvNp57dbni+pLahZs/IsbWP1DYVfau1d++ddpENoafWr1k7gOzhmvCrha7OTh566EGNYeme
            vgy+51186qmnVqHUnY119XRt2+o98sgj5PN5crmhZtiBknwH6c3gSwiM6PCNoWMLwxDDMOnq7OS5
            Z59VlU3NZl+6ry+RSCwPAo+1a9eGrusShq+ew73BBDDYOEHBWBEw2KIYi8UKgpNBJpOP5IUgpLGx
            XpVXVITz5h8VtEydHDpJi8UrnhMbNm9MIgXCkPcYpglBIG6//Xa6092YyCG85kWp5YPOycFjHEQu
            mzdv4dE77ghapk+XSqudJSVlf/Q8D9M0f9DV0UHViLHWNV/7ZrjkiWcpLyofQHBUNGpwHxh5SDOM
            EiClGZW5tWx2bNvO2oceC+qqG/By4ZPnnXfenl27dslRo0crKY1XsOW+GF7Dqn2HA5ID8ukgghjy
            XWRcamocDcJDyF6kMsn0JgwnVhwaTlhrJcwNRkqWPL98sb7z6afEEXPnEjK0juDggBJZqGM82Aag
            iXoO+ASEXsh//r+v8burf+bPnrvA6mpr/0m2r+/SuOPEFeSsmHNNaWXlha3tHfmdW7c63/7JVWLK
            whmEliRwPVSg8XM+lm0NREhn8hm0gEBGd9WFEjfRHi0hNChJxGnft5uv/b+v0r037ZXZKdvv6/zA
            iKa6P2sjMLfv2haYponrulj9WkBBCNwabRkvCa99Af9/CApNK4ZG3A37zgc8SksdhHRBuGgs4k6d
            HtE0yezq7OoNg/zoopLU7NautsD1fOO0M84gDDW+1iDFkBUPBy8HJ9AEhdqezz7xNFdefKmeOnee
            Ebh+oJT+uCGNNsMwDY0KdcgdmW73yMriygnlJeX56/70Z/a07pPp3j5hapOqskpKS0sxjShhNO/n
            IwGxnxcoPRBWhtaEXoAMobe7l//58Q9Z9dBj+aam8Y6XcZ8d0dR4qVI+zzz7FDW1NTqdTiMNOdAM
            q79hY3d391uRAF45lJSUDDws2sHLOezc0SYcJ65LSku3dPfuv2js+DHGQ7fcqmfOmydGjRmLZUpC
            paMgzH7kc/AuZhYCT4W0t+7n7ee8DduJ+6l40sik+66dOGnyr6UZM/Ou65dXlZi5bF4lrIob8mn/
            RAsxqqq41FizeKV46t77vXtvuZv21v0yFjfRUlFaVYphC7TvIXW04g0EtjQgVMRMG0sY7Ny6m6u/
            /2OWP/CAN3XekU6mJ60J/FNKiuJtuWyf5cTs0PVdHMcZ2oLu348Aoj6gjp0ikYjp9s49RhBmWy1b
            l8Ucc35NU7P786uvNk8740wqq6qjhy/kIgyG4QSQ91z6Onv4wmcvY+3jjwUTp06zOtrau0uKis4t
            KS7OPP3UkyKesHXop1VDXYPZ0+n7tlX0Z9fNOZqwsbGqpnTcyDFGTVWlfPzhB4MH779P79nXShD4
            wjEdSuMpDK0wlMDQ4OXylBeX0L5vPw/eez/f/NSnddoN/MlTptiZvj504L19RHPd426+z0qm4n5P
            XzdhGGKaJpZpEfSrj6+QAN6kMsArgYjVNTc3Fva7QsMLmcDzAnbt3iYbGxtVcVG5nfP8pfFkYko6
            n8vt2L0n/sc//4kTTj4J07GJy2gzCcJCDQMNsr91Txiyctlyvvfd7/DoPfd6YyeOt5XrYcJp01qm
            3NPd2Wnu2LEtQAQoEYBKsGlzr9lYPyWw4wLT8BLa62zJZbvPShYVfyCeLBqlDZP1mzbj5XI+Ycgp
            7znHmDN3lmxoaKC+vp729nZa97Vy19136ScffCQYOXq84ZiWFKh9oZ97d1VZ8nFBYEodiTF79rUP
            mRU9rJ7tli1bXnYW38IEQIEAmoe4OZWK9GXfzTBy5Fhr1qyF/u233z0257nP1dbXl3X09OS2b95k
            HXnCCebCY45m5vRZNDc1UVtbh21baC3YtWsX69at44YbbuDeW28NRSLuT544MZbr7UEq/7PTp067
            at+eXVZTQ72/fMVSEAFaKJSOEapKtm7ZZ8SL4lRXl4TzZkwgZmqWr1zl5D11nhNLXeiH+ohEqhjP
            z7NuwwqNl/WwLTF64iSxZe1aCPPKLq2WE8dPtHq7MpjC+lPCiV0STxrdppG3kJ4vNaAle/btZ7DO
            8u9HACMah3zud58GnodtxaiqrLOOPf4E/64775oS6PAOIxYf4cRjrF69WmmtQ7wQVCDrGkfIGdNn
            sK91P8uXLNZRao2kZfp0SxGSy/Rp25Cfnjlt8v/cfustMlRKv+fd79RPPfsM/XqDFhLbTuK5Pq6b
            Y9fOnaIoXi5bWqbKCePH+m4QxaUtWb5sYc7Nvy2RiJ0Shl5LPJFASkkul0OFIfFEApTGzekXwqxx
            ZX11882xWIK+TLvlJLI+4oDvf9++PUOf/9+SAAYZVvoDRQwMPC/gne94J0uXrbKOPOpY/+abbi2L
            FRV9JZtNv8eJifri4hRCRy7cro4Odu7YDdpk3PjxlFYU0dvbTXdvT7dpOn8XwvjB1JYJa265+c8S
            0Oe997061JqlS5cO0R6UDolZNtlcmridZN6chRiWw/9ee62YPKXFmjxpiicMSagU27ftsHp6+o51
            c/kTnZiYq5Rf7/tB2pDm+iAwHgjy6oaxoyblVi5bbQBMn90SKnp4MQEcUJP/7QjgAAyusn/gXHND
            I5IEtdUTrOdf2OkLQ1JdW1yE0Tsrm+1aYJhygSnlONuKVTl2slSFtu+6ubZMvnWFYYQ3J4uL7967
            p30/KsGUyePNVeueCEFpVJSC1dXVOWwcQxFQ31AZIasQJrdvT7tsaZlh1tU1q5XL1wVhaKLDAMNK
            I03PAnwV2AhVgtaa8qq4/cKmJX5dVbMWhiDULlqHA4hua2s7rFn7lyeAuuo6pIhTVtzI7r2dRi6X
            pbQiFTpxH9fLELcdtm7fIuprmyqEMCrQph9POHtz+Z6ckCFBmKWrs0+mEpUiVH4ozELvs5ckgMGg
            qW0sp78XE9okDEAKh9Z9e0RxUb2cMeUIsXzFYh1P+aET0+TzeXq6Xblg3ily7dq12rAzoev3HDDw
            DIO2to7DmrW3vBp4AA4W4ycoLqoEoQlELxi9Olmk9P62HSL0Q6O+bpS5e2eXqK0erQwjntWaDsPy
            uizbDPq6pFFfO9bctHmdLi0t1kHo6VjMRiuBwCp4+CCXL3TofgnjcipVBtoqhM0LTNPC8/KkipI4
            MUN39+xVyJx24orde/aKTDonauvL9P62PUpIV/tBlljMORDUMszcm83mDmvW/oUI4GAgKCkuBxHg
            h31YjkKaIclkjJiT0AJDSWHqzs4ekUn3GfPmzTIsO5QrVy2hOFWnfF8pCED4xOIGnucWMhWMAVNr
            LpcbuNeLQZJMlhWSZgA0liXR2kcaCt/PEY8bhMqNiCKVoKgkUTBNB0hDYZom2UwW0zQPaus/XAL4
            F9oCDg6NjY1oHRJqdyB/AABtIoQFWg6KY4ycU1rrgbD2fD4bOahkPnLgBLFoP5dRylVHZxcvXftO
            UlPbdODahNG1RIDWBRukKqSZDLtGf1OHIT79g0Db/qFbgH6lfW0K8IZHBL1uMKw7egQF72N/rODg
            34hCTt1LxtUNLb38krft7/RIf67fQa6jh8dDRBG++h9yWL86+BcngP7Q9IJpb/BE60JjOREwECjW
            L60PgQISVCE9XQgGCg0LAcIYykeVPvj/DwnTkoOKIYlB5we1dRuIHeiPJXttiOFfnAAoEEDUKO4A
            FAhAHIxd9nf9G77CD8JBDlX2lGGxDkP+b3iewvAQlddHPPv/L/TQApGEd88AAAAldEVYdGRhdGU6
            Y3JlYXRlADIwMjMtMDctMjlUMTU6MzE6NDErMDM6MDCwFSsaAAAAJXRFWHRkYXRlOm1vZGlmeQAy
            MDIzLTA3LTI5VDE1OjMxOjQxKzAzOjAwwUiTpgAAAABJRU5ErkJggg==
            " />
            </svg>:
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="128px" height="128px" viewBox="0 0 128 128" xmlSpace="preserve">  <image id="image0" width="128" height="128" x="0" y="0"
                xlinkHref="data:image/png;base64,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" />
            </svg>}
              { tile && (
                <SrOnly>Occupied by  
                  {gameMode==="cpu"? tile==="X"? ` X` : ` CPU`: null}
                  {gameMode==="local"? ` ${tile}`: null}
                </SrOnly>) }
            </CollumnCell>
          )
        })}
      </Row>
    ));

    return tiles;
  }

  const handleShowNux = () =>{
    if ( !mouseDown.current && tutorial ) {
      setShowNux(true);
      dispatch({ type: "TUTORIAL_OFF" });
    }
  }

  useEffect(() =>{
    if ( showNuxOnce ) {
      components.current[currentIndex.current].focus();
    }
  },[ showNuxOnce ])

  useEffect(() =>{
    if ( gameMode==="cpu" && typeof cpuMove==="number" && moveLiveRegion.current ) {
      moveLiveRegion.current.textContent = `CPU placed ${cpu.globalPlayer==="X"? "O": "X"} at row ${Math.floor(cpuMove/3+1)} column ${cpuMove%3+1}.`;
    }
  }, [ cpuMove ])

  useEffect(() =>{
    if ( !online?.onGoingGame || !moveLiveRegion.current ) return;

    const { opponentMove } = online.onGoingGame;
    const { globalPlayer } = online.onGoingGame.game;

    if ( opponentMove!==-1  ) {
      moveLiveRegion.current.textContent = `Opponent placed ${ globalPlayer==="X"? "O": "X" } at row ${Math.floor(opponentMove/3+1)} column ${opponentMove%3+1}.`;
    }
  }, [ online?.onGoingGame?.opponentMove ])

  return (
    <>
      <SrOnly
        as="h2"
        id="grid-moves" >tic tac toe grid moves
      </SrOnly>
      <p 
        className="sr-only"
        aria-live="polite"
        ref={moveLiveRegion}
        data-testid="move-region" />
      <Wrapper 
        role="grid"
        aria-labelledby="grid-moves"
        onFocus={handleShowNux}
        onKeyDown={registerArrow}>
        { renderTiles() }
        { showNux && <Nux setShowNux={ setShowNux } setShowNuxOnce={ setShowNuxOne } />}
      </Wrapper>
    </>
  );
}


export default Tiles;