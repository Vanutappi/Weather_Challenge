import { Component } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true
})

export class AppRoot {

  render() {
    return (
      <div>
        <header>
          <h1>Weather Challenge</h1>
        </header>
        <main>
          <app-form></app-form>
        </main>
      </div>
    );
  }
}