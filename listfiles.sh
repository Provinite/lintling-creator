echo "{"
PARTS=(teeth coat ears eyes paws tail teeth whiskers)
NUMPARTS=8
CURRENTPART=0
for part in ${PARTS[@]}; do
	CURRENTPART=$((CURRENTPART + 1))
	echo "    \"$part\":["
	IMAGES=`ls ./client/assets/image/$part`
	NUMIMAGES=`ls ./client/assets/image/$part | wc -l`
	CURRENTIMAGE=0
	for image in ${IMAGES[@]}; do
		CURRENTIMAGE=$((CURRENTIMAGE + 1))
		echo -n "        \"$image\""
		if [[ "$CURRENTIMAGE" -ne "$NUMIMAGES" ]]; then
			echo ","
		else
			echo ""
		fi
	done
	echo -n "    ]"
	if [[ "$CURRENTPART" -ne "$NUMPARTS" ]]; then
		echo ","
	else
		echo ""
	fi
done
echo "}"