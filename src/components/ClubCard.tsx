import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

type ClubCardProps = {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    availableOn: number;
};

export default function ClubCard({ id, name, description, imageUrl, availableOn }: ClubCardProps) {
    return (
        <Link href={`/clubs/${id}`}>
            <Card sx={{ width: 320, position: 'relative' }}>
                <Image
                    src={imageUrl}
                    alt={name}
                    width={"320"}
                    height={0}
                    className='w-[320px] h-[180px]'
                />
                {availableContents(availableOn)}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                </CardActions>
            </Card>
        </Link>
    );
}

const availableContents = (availableOn: number): undefined | React.JSX.Element => {
    if ((availableOn & 0x1) == 0x1 && (availableOn & 0x2) == 0x2) {
        return (
            <>
                <Box
                    component="img"
                    src="/img/jhs.png"
                    sx={{
                        position: 'absolute',
                        top: 140,
                        right: 8,
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
                <Box
                    component="img"
                    src="/img/kotobu.png"
                    sx={{
                        position: 'absolute',
                        top: 140,
                        right: 48,
                        height: 35,
                        width: 35,
                        borderRadius: '50%',
                        border: '2px solid white',
                        boxShadow: 2,
                    }}
                    alt="Small logo"
                />
            </>
        );
    }
    if ((availableOn & 0x1) == 0x1) {
        return (
            <Box
                component="img"
                src="/img/kotobu.png"
                sx={{
                    position: 'absolute',
                    top: 140,
                    right: 8,
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    if ((availableOn & 0x2) == 0x2) {
        return (
            <Box
                component="img"
                src="/img/jhs.png"
                sx={{
                    position: 'absolute',
                    top: 140,
                    right: 8,
                    height: 35,
                    width: 35,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                }}
                alt="Small logo"
            />
        );
    }
    return undefined;
}
