import React from 'react';
import SceneWrapper from '@components/layout/SceneWrapper';
import { LetterProvider } from './context/LetterContext';
import FriendshipLetterScene from './components/FriendshipLetterScene';

function LetterScene() {
  return (
    <SceneWrapper sceneName="letter" className="bg-[#04020f] overflow-hidden">
      <LetterProvider>
        <FriendshipLetterScene />
      </LetterProvider>
    </SceneWrapper>
  );
}

export default LetterScene;
