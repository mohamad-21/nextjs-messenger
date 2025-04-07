import React from "react";
import { Dialog, DialogContent } from "./ui/dialog";

function ShowPictureDialog({ image, open, onClose }: { image: string, open: boolean, onClose: Function }) {
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="max-w-4xl p-9 bg-transparent border-none flex items-center justify-center [&>button:last-child]:hidden !pointer-events-none">
        <img src={image} alt="image" className="max-w-full object-contain rounded-lg" />
      </DialogContent>
    </Dialog>

  )
}

export default ShowPictureDialog;
