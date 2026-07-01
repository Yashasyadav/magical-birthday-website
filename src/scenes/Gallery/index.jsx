import SceneWrapper from '@components/layout/SceneWrapper';
import { MemoryProvider } from './context/MemoryContext';
import MemoryScene from './components/MemoryScene';

function GalleryScene() {
  return (
    <SceneWrapper sceneName="gallery" className="bg-[#04020f] overflow-hidden">
      <MemoryProvider>
        <MemoryScene />
      </MemoryProvider>
    </SceneWrapper>
  );
}

export default GalleryScene;
