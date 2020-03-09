import React from 'react';
//import GameContent from '../ts/game'

export default class Game extends React.Component {

  /*   public game: GameContent;
    public componentDidMount() {
      this.game = new GameContent()
    } */

  public render(): JSX.Element {
    return (
      <div className="game_container">
        <canvas id="game" width="1000px" height="500px"></canvas>
      </div>
    );
  }
}
